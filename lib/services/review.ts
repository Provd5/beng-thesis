"use server";

import { type ReadonlyURLSearchParams } from "next/navigation";

import {
  type GetReviewReactionInterface,
  type ReviewInterface,
} from "~/types/data/review";
import { type GetDataList } from "~/types/list";
import { SortBooksArray } from "~/types/orderArrays";
import { type SortReviewsType } from "~/types/sort";

import { sortParamsValidator } from "~/utils/sortParamsValidator";

import { db } from "../db";
import readUserSession from "../supabase/readUserSession";
import { GlobalErrors } from "../validations/errorsEnums";
import {
  CreateReviewValidator,
  DeleteReviewValidator,
  ReviewReactionValidator,
} from "../validations/review";

export class ReviewService {
  private itemsPerPage = 15;
  private totalPages = (allItems: number) =>
    Math.ceil(allItems / this.itemsPerPage);

  async getQuantity(bookId: string): Promise<number> {
    try {
      const quantity = await db.review.count({
        where: { book_id: bookId },
      });

      return quantity;
    } catch (e) {
      throw new Error(`Error while fetching reviews quantity.`);
    }
  }

  async getAllReviews(
    bookId: string,
    searchParams: ReadonlyURLSearchParams
  ): Promise<GetDataList<ReviewInterface>> {
    const validSearchParams = sortParamsValidator(searchParams, SortBooksArray);
    const { order, orderBy: defaultOrderBy, page } = validSearchParams;
    const orderBy = defaultOrderBy as SortReviewsType;

    try {
      const [allItems, reviews] = await Promise.all([
        this.getQuantity(bookId),
        db.review.findMany({
          skip: (page - 1) * this.itemsPerPage,
          take: this.itemsPerPage,
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
              : orderBy === "review_reaction"
              ? { review_reaction: { _count: order } }
              : { [orderBy]: order },
          where: { book_id: bookId },
        }),
      ]);

      return {
        page,
        totalPages: this.totalPages(allItems),
        allItems,
        itemsPerPage:
          reviews.length < this.itemsPerPage
            ? reviews.length
            : this.itemsPerPage,
        data: reviews,
      };
    } catch (e) {
      throw new Error(`Error while fetching reviews.`);
    }
  }

  async getReview(bookId: string): Promise<ReviewInterface | null | undefined> {
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
      throw new Error(`Error while fetching review.`);
    }
  }

  async getReactions(reviewId: string): Promise<GetReviewReactionInterface> {
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
          sessionReaction === undefined ? undefined : sessionReaction?.reaction,
      };
    } catch (e) {
      throw new Error(`Error while fetching review reaction.`);
    }
  }

  async postReaction(reviewId: unknown, reaction: unknown): Promise<Response> {
    try {
      const {
        data: { session },
      } = await readUserSession();

      if (!session?.user) {
        throw new Error(GlobalErrors.UNAUTHORIZED);
      }

      const validData = ReviewReactionValidator.parse({ reviewId, reaction });

      const currentReaction = await db.review_reaction.findFirst({
        where: { review_id: validData.reviewId, user_id: session.user.id },
      });

      if (currentReaction && currentReaction.reaction === validData.reaction) {
        await db.review_reaction.delete({
          where: {
            user_id_review_id: {
              review_id: validData.reviewId,
              user_id: session.user.id,
            },
          },
        });
      } else {
        await db.review_reaction.upsert({
          where: {
            user_id_review_id: {
              review_id: validData.reviewId,
              user_id: session.user.id,
            },
          },
          update: {
            reaction: validData.reaction,
          },
          create: {
            review_id: validData.reviewId,
            user_id: session.user.id,
            reaction: validData.reaction,
          },
        });
      }

      return new Response();
    } catch (e) {
      throw new Error(GlobalErrors.SOMETHING_WENT_WRONG);
    }
  }

  async postReview(bookId: unknown, formData: unknown): Promise<Response> {
    try {
      const {
        data: { session },
      } = await readUserSession();

      if (!session?.user) {
        throw new Error(GlobalErrors.UNAUTHORIZED);
      }

      const validData = CreateReviewValidator.parse({
        bookId,
        ...{ formData },
      });

      const reviewExists = await db.review.findFirst({
        where: {
          author_id: session.user.id,
          book_id: validData.bookId,
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
            book_id: validData.bookId,
            text: validData.text,
            rate: validData.rate,
            updated_at: null,
          },
        });
      }

      // on success
      // revalidatePath("/", "layout");
      return new Response();
    } catch (e) {
      throw new Error(GlobalErrors.SOMETHING_WENT_WRONG);
    }
  }

  async deleteReview(reviewId: unknown): Promise<Response> {
    try {
      const {
        data: { session },
      } = await readUserSession();

      if (!session?.user) {
        throw new Error(GlobalErrors.UNAUTHORIZED);
      }

      const validData = DeleteReviewValidator.parse({
        reviewId,
      });

      await db.review.delete({
        where: { id: validData.reviewId },
      });

      // on success
      // revalidatePath("/", "layout");
      return new Response();
    } catch (e) {
      throw new Error(GlobalErrors.SOMETHING_WENT_WRONG);
    }
  }
}
