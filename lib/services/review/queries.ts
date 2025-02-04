"use server";

import {
  type GetReviewInterface,
  type GetReviewReactionInterface,
  type ReviewInterface,
} from "~/types/data/review";
import { type GetDataList } from "~/types/list";
import { SortReviewsArray } from "~/types/orderArrays";
import { type SortReviewsType } from "~/types/sort";

import { db } from "~/lib/db";
import { errorHandler } from "~/lib/errorHandler";
import { unstable_cache } from "~/lib/unstable-cache";
import { totalPages } from "~/lib/utils/totalPages";
import { sortParamsValidator } from "~/utils/sortParamsValidator";

const itemsPerPage = 15;

export const getReviewQuantity = unstable_cache(
  async (bookId: string): Promise<number> => {
    try {
      const quantity = await db.review.count({
        where: { book_id: bookId },
      });

      return quantity;
    } catch (e) {
      throw new Error(errorHandler(e));
    }
  },
  ["review-quantity"],
  { revalidate: 60 * 60 * 2 }, // two hours
);

export const getAllReviews = unstable_cache(
  async (
    bookId: string,
    searchParams: unknown,
  ): Promise<GetDataList<GetReviewInterface>> => {
    const validSearchParams = sortParamsValidator(
      searchParams,
      SortReviewsArray,
    );
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
  },
  ["all-reviews"],
  { revalidate: 60 * 60 * 2 }, // two hours
);

export const getReview = unstable_cache(
  async (
    sessionId: string | undefined,
    bookId: string,
  ): Promise<ReviewInterface | null | undefined> => {
    try {
      if (!sessionId) return undefined;

      const review = await db.review.findFirst({
        where: { book_id: bookId, author_id: sessionId },
      });

      return review;
    } catch (e) {
      throw new Error(errorHandler(e));
    }
  },
  ["review"],
  { revalidate: 60 * 60 * 2 }, // two hours
);

export const getReactions = unstable_cache(
  async (
    sessionId: string | undefined,
    reviewId: string,
  ): Promise<GetReviewReactionInterface> => {
    try {
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
        sessionId
          ? db.review_reaction.findFirst({
              where: {
                review_id: reviewId,
                user_id: sessionId,
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
  },
  ["reactions"],
  { revalidate: 60 * 60 * 2 }, // two hours
);
