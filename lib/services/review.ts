"use server";

import { type ReadonlyURLSearchParams } from "next/navigation";

import {
  type GetReviewInterface,
  type GetReviewReactionInterface,
  type ReviewInterface,
} from "~/types/data/review";
import { type GetDataList } from "~/types/list";
import { SortReviewsArray } from "~/types/orderArrays";
import { type SortReviewsType } from "~/types/sort";

import { sortParamsValidator } from "~/utils/sortParamsValidator";

import { db } from "../db";
import { errorHandler } from "../errorHandler";
import readUserSession from "../supabase/readUserSession";
import { totalPages } from "../utils/totalPages";
import { ErrorsToTranslate } from "../validations/errorsEnums";
import { UuidValidator } from "../validations/others";
import {
  CreateReviewValidator,
  ReviewReactionValidator,
} from "../validations/review";

const itemsPerPage = 15;

export async function getReviewQuantity(bookId: string): Promise<number> {
  try {
    const quantity = await db.review.count({
      where: { book_id: bookId },
    });

    return quantity;
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function getAllReviews(
  bookId: string,
  searchParams: ReadonlyURLSearchParams
): Promise<GetDataList<GetReviewInterface>> {
  const validSearchParams = sortParamsValidator(searchParams, SortReviewsArray);
  const { order, orderBy: defaultOrderBy, page } = validSearchParams;
  const orderBy = defaultOrderBy as SortReviewsType;

  try {
    const [allItems, reviews] = await Promise.all([
      getReviewQuantity(bookId),
      db.review.findMany({
        skip: (page - 1) * itemsPerPage,
        take: itemsPerPage,
        orderBy:
          orderBy === "activity"
            ? [
                { profile: { review: { _count: order } } },
                { profile: { review_reaction: { _count: order } } },
                { profile: { followed_by: { _count: order } } },
                { profile: { following: { _count: order } } },
                { profile: { book_owned_as: { _count: order } } },
                { profile: { bookshelf: { _count: order } } },
                { profile: { liked_book: { _count: order } } },
              ]
            : orderBy === "reactions"
            ? { review_reaction: { _count: order } }
            : { [orderBy]: order },
        where: { book_id: bookId },
        include: {
          profile: {
            include: {
              _count: {
                select: {
                  bookshelf: { where: { bookshelf: "ALREADY_READ" } },
                  liked_book: { where: { book_id: bookId } },
                  review: { where: { book_id: bookId } },
                },
              },
            },
          },
          review_reaction: true,
        },
      }),
    ]);

    return {
      page,
      totalPages: totalPages(allItems, itemsPerPage),
      allItems,
      itemsPerPage:
        reviews.length < itemsPerPage ? reviews.length : itemsPerPage,
      data: reviews,
    };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function getReview(
  bookId: string
): Promise<ReviewInterface | null | undefined> {
  try {
    const {
      data: { session },
    } = await readUserSession();

    if (!session) return undefined;

    const review = await db.review.findFirst({
      where: { book_id: bookId, author_id: session.user.id },
    });

    return review;
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function getReactions(
  reviewId: string
): Promise<GetReviewReactionInterface> {
  try {
    const {
      data: { session },
    } = await readUserSession();

    const [upQuantity, downQuantity, sessionReaction] = await Promise.all([
      db.review_reaction.count({
        where: {
          review_id: reviewId,
          reaction: "OK",
        },
      }),
      db.review_reaction.count({
        where: {
          review_id: reviewId,
          reaction: "MEH",
        },
      }),
      session
        ? db.review_reaction.findFirst({
            where: {
              review_id: reviewId,
              user_id: session.user.id,
            },
          })
        : undefined,
    ]);

    return {
      upQuantity,
      downQuantity,
      sessionReaction:
        sessionReaction === null ? null : sessionReaction?.reaction,
    };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function postReaction(
  reviewId: unknown,
  reaction: unknown
): Promise<{ success: boolean }> {
  try {
    const {
      data: { session },
    } = await readUserSession();

    if (!session?.user) {
      throw new Error(ErrorsToTranslate.UNAUTHORIZED);
    }

    const validReviewData = UuidValidator.parse(reviewId);
    const validReaction = ReviewReactionValidator.parse(reaction);

    const currentReaction = await db.review_reaction.findFirst({
      where: { review_id: validReviewData, user_id: session.user.id },
    });

    if (currentReaction && currentReaction.reaction === validReaction) {
      await db.review_reaction.delete({
        where: {
          user_id_review_id: {
            review_id: validReviewData,
            user_id: session.user.id,
          },
        },
      });
    } else {
      await db.review_reaction.upsert({
        where: {
          user_id_review_id: {
            review_id: validReviewData,
            user_id: session.user.id,
          },
        },
        update: {
          reaction: validReaction,
        },
        create: {
          review_id: validReviewData,
          user_id: session.user.id,
          reaction: validReaction,
        },
      });
    }

    return { success: true };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function postReview(
  bookId: unknown,
  formData: object
): Promise<{ success: boolean }> {
  try {
    const {
      data: { session },
    } = await readUserSession();

    if (!session?.user) {
      throw new Error(ErrorsToTranslate.UNAUTHORIZED);
    }

    const validBookId = UuidValidator.parse(bookId);
    const validData = CreateReviewValidator.parse(formData);

    const reviewExists = await db.review.findFirst({
      where: {
        author_id: session.user.id,
        book_id: validBookId,
      },
      select: { id: true },
    });

    if (reviewExists) {
      await db.review.update({
        where: { id: reviewExists.id },
        data: {
          text: validData.text,
          rate: validData.rate,
        },
      });
    } else {
      await db.review.create({
        data: {
          author_id: session.user.id,
          book_id: validBookId,
          text: validData.text,
          rate: validData.rate,
          updated_at: null,
        },
      });
    }

    // on success
    // revalidatePath("/", "layout");
    return { success: true };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function deleteReview(
  reviewId: unknown
): Promise<{ success: boolean }> {
  try {
    const {
      data: { session },
    } = await readUserSession();

    if (!session?.user) {
      throw new Error(ErrorsToTranslate.UNAUTHORIZED);
    }

    const validReviewId = UuidValidator.parse(reviewId);

    await db.review.delete({
      where: { id: validReviewId },
    });

    // on success
    // revalidatePath("/", "layout");
    return { success: true };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}
