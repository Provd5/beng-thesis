"use server";

import { revalidateTag } from "next/cache";

import { db } from "~/lib/db";
import { errorHandler } from "~/lib/errorHandler";
import { ErrorsToTranslate } from "~/lib/validations/errorsEnums";
import { UuidValidator } from "~/lib/validations/others";
import {
  CreateReviewValidator,
  ReviewReactionValidator,
} from "~/lib/validations/review";

import { getSessionUser } from "../session/queries";

export async function postReaction(
  reviewId: unknown,
  reaction: unknown,
): Promise<{ success: boolean }> {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      throw new Error(ErrorsToTranslate.UNAUTHORIZED);
    }

    const validReviewData = UuidValidator.parse(reviewId);
    const validReaction = ReviewReactionValidator.parse(reaction);

    const currentReaction = await db.review_reaction.findFirst({
      where: { review_id: validReviewData, user_id: sessionUser.id },
    });

    if (currentReaction && currentReaction.reaction === validReaction) {
      await db.review_reaction.delete({
        where: {
          user_id_review_id: {
            review_id: validReviewData,
            user_id: sessionUser.id,
          },
        },
      });
    } else {
      await db.review_reaction.upsert({
        where: {
          user_id_review_id: {
            review_id: validReviewData,
            user_id: sessionUser.id,
          },
        },
        update: {
          reaction: validReaction,
        },
        create: {
          review_id: validReviewData,
          user_id: sessionUser.id,
          reaction: validReaction,
        },
      });
    }

    // on success
    revalidateTag("reactions");
    revalidateTag("all-reviews");
    return { success: true };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function postReview(
  bookId: unknown,
  formData: unknown,
): Promise<{ success: boolean }> {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      throw new Error(ErrorsToTranslate.UNAUTHORIZED);
    }

    const validBookId = UuidValidator.parse(bookId);
    const validData = CreateReviewValidator.parse(formData);

    const reviewExists = await db.review.findFirst({
      where: {
        author_id: sessionUser.id,
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
          author_id: sessionUser.id,
          book_id: validBookId,
          text: validData.text,
          rate: validData.rate,
          updated_at: null,
        },
      });
    }

    // on success
    revalidateTag("review");
    revalidateTag("all-reviews");
    revalidateTag("book");
    revalidateTag("all-books");
    revalidateTag("review-books");
    revalidateTag("profile");
    return { success: true };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function deleteReview(
  reviewId: unknown,
): Promise<{ success: boolean }> {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      throw new Error(ErrorsToTranslate.UNAUTHORIZED);
    }

    const validReviewId = UuidValidator.parse(reviewId);

    await db.review.delete({
      where: { id: validReviewId },
    });

    // on success
    revalidateTag("review");
    revalidateTag("all-reviews");
    revalidateTag("book");
    revalidateTag("all-books");
    revalidateTag("review-books");
    revalidateTag("profile");
    return { success: true };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}
