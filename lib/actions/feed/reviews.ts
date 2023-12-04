"use server";

import { unstable_noStore } from "next/cache";
import { z } from "zod";

import { type ReviewCardDataInterface } from "~/types/feed/ReviewCardDataInterface";
import { REVIEWS_FEED_TAKE_LIMIT } from "~/types/feed/TakeLimits";

import { db } from "~/lib/db";

const ParamsValidator = z.object({
  orderBy: z
    .enum(["profile_traffic", "created_at", "rate", "review_reaction"])
    .nullish(),
  order: z.enum(["asc", "desc"]).nullish(),
  page: z.string().nullish(),
});

export async function fetchReviews(
  bookId: string,
  searchParams:
    | {
        orderBy?: string;
        order?: "asc" | "desc";
        page?: string;
      }
    | undefined
): Promise<ReviewCardDataInterface[]> {
  unstable_noStore();

  try {
    const { orderBy, order, page } = ParamsValidator.parse(searchParams);

    const takeLimit = REVIEWS_FEED_TAKE_LIMIT;
    const parsedPage = page ? parseInt(page) : 1;
    const skipItems = (parsedPage - 1) * takeLimit;
    const defaultOrder = order || "desc";

    let orderByClause = null;
    switch (orderBy) {
      case "created_at":
      case "rate":
        orderByClause = { [orderBy]: defaultOrder };
        break;
      case "review_reaction":
        orderByClause = { [orderBy]: { _count: defaultOrder } };
        break;
      case "profile_traffic":
      default:
        orderByClause = [
          { profile: { review: { _count: defaultOrder } } },
          { profile: { review_reaction: { _count: defaultOrder } } },
          { profile: { followed_by: { _count: defaultOrder } } },
          { profile: { following: { _count: defaultOrder } } },
          { profile: { book_owned_as: { _count: defaultOrder } } },
          { profile: { bookshelf: { _count: defaultOrder } } },
          { profile: { liked_book: { _count: defaultOrder } } },
        ];
        break;
    }

    const reviews = (await db.review.findMany({
      take: takeLimit,
      skip: skipItems,
      where: {
        book_id: bookId,
        text: { not: null },
        profile: {
          full_name: { not: null },
        },
      },
      orderBy: orderByClause,
      select: {
        id: true,
        rate: true,
        text: true,
        updated_at: true,
        created_at: true,
        review_reaction: true,
        profile: {
          select: {
            id: true,
            avatar_url: true,
            full_name: true,
            created_at: true,
            _count: {
              select: {
                bookshelf: {
                  where: { bookshelf: { equals: "ALREADY_READ" } },
                },
                review: true,
                liked_book: { where: { book_id: bookId } },
              },
            },
          },
        },
      },
    })) as ReviewCardDataInterface[];

    return reviews;
  } catch (error) {
    return [];
  }
}

export async function fetchReviewsCount(bookId: string) {
  unstable_noStore();

  const reviewsCount = await db.review.count({
    where: {
      book_id: bookId,
      text: { not: null },
      profile: {
        full_name: { not: null },
      },
    },
  });

  return reviewsCount;
}
