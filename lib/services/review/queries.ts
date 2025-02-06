"use server";

import { unstable_cache } from "next/cache";

import {
  type GetReviewInterface,
  type ReviewInterface,
} from "~/types/data/review";
import { type GetDataList } from "~/types/list";
import { SortReviewsArray } from "~/types/orderArrays";
import { type SortReviewsType } from "~/types/sort";

import { db } from "~/lib/db";
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
      return 0;
    }
  },
  ["review-quantity"],
  { revalidate: 60 * 60 * 2, tags: ["review-quantity"] }, // two hours
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
                    review: true,
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
      return {
        page: 0,
        totalPages: 0,
        allItems: 0,
        itemsPerPage: 0,
        data: [],
      };
    }
  },
  ["all-reviews"],
  { revalidate: 60 * 60 * 2, tags: ["all-reviews"] }, // two hours
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
      return null;
    }
  },
  ["review"],
  { revalidate: 60 * 60 * 2, tags: ["review"] }, // two hours
);
