"use server";

import { z } from "zod";

import { type CategoryTypes } from "~/types/CategoryTypes";
import {
  BOOKS_FEED_TAKE_LIMIT,
  PROFILE_PAGE_BOOKS_TAKE_LIMIT,
} from "~/types/feed/TakeLimits";

import { db } from "~/lib/db";
import readUserSession from "~/lib/supabase/readUserSession";

const ParamsValidator = z.object({
  orderBy: z
    .enum([
      "last_added",
      "popularity",
      "liked_by",
      "review",
      "published_date",
      "title",
      "authors",
    ])
    .nullish(),
  order: z.enum(["asc", "desc"]).nullish(),
  page: z.string().nullish(),
});

export async function fetchBooks(
  variant: CategoryTypes | null,
  fullname: string | null,
  searchParams:
    | {
        orderBy?: string;
        order?: "asc" | "desc";
        page?: string;
      }
    | undefined
): Promise<BookCardInterface[] | BookInterface[] | BookReviewCardInterface[]> {
  try {
    const {
      data: { session },
    } = await readUserSession();

    const { orderBy, order, page } = ParamsValidator.parse(searchParams);

    const takeLimit = variant
      ? PROFILE_PAGE_BOOKS_TAKE_LIMIT
      : BOOKS_FEED_TAKE_LIMIT;
    const parsedPage = page ? parseInt(page) : 1;
    const skipItems = (parsedPage - 1) * takeLimit;
    const defaultOrder = order || "desc";

    let orderByClause = null;
    switch (orderBy) {
      case "authors":
      case "title":
      case "published_date":
        orderByClause = { book: { [orderBy]: defaultOrder } };
        break;
      case "liked_by":
      case "review":
        orderByClause = { book: { [orderBy]: { _count: defaultOrder } } };
        break;
      case "last_added":
        orderByClause = null;
        break;
      case "popularity":
      default:
        orderByClause = [
          { book: { liked_by: { _count: defaultOrder } } },
          { book: { review: { _count: defaultOrder } } },
          { book: { book_owned_as: { _count: defaultOrder } } },
          { book: { bookshelf: { _count: defaultOrder } } },
        ];
        break;
    }

    let allBooksOrderByClause = null;
    switch (orderBy) {
      case "authors":
      case "title":
      case "published_date":
        allBooksOrderByClause = { [orderBy]: defaultOrder };
        break;
      case "liked_by":
      case "review":
        allBooksOrderByClause = { [orderBy]: { _count: defaultOrder } };
        break;
      case "last_added":
      case "popularity":
      default:
        allBooksOrderByClause = [
          { liked_by: { _count: defaultOrder } },
          { review: { _count: defaultOrder } },
          { book_owned_as: { _count: defaultOrder } },
          { bookshelf: { _count: defaultOrder } },
        ];
        break;
    }

    const commonSelect = {
      id: true,
      title: true,
      authors: true,
      thumbnail_url: true,
    };

    const selectClause =
      variant === "REVIEWS"
        ? {
            ...commonSelect,
            review: {
              where: { profile: { full_name: fullname } },
              include: {
                review_reaction: true,
              },
            },
          }
        : {
            ...commonSelect,
            _count: { select: { review: true, liked_by: true } },
            review: { select: { rate: true } },
            ...(!!session?.user
              ? {
                  bookshelf: { where: { profile: { id: session.user.id } } },
                  book_owned_as: {
                    where: { profile: { id: session.user.id } },
                  },
                  liked_by: { where: { profile: { id: session.user.id } } },
                }
              : {}),
          };

    if (!variant || variant === "STATISTICS") {
      const books = await db.book.findMany({
        orderBy: allBooksOrderByClause,
        take: takeLimit,
        skip: skipItems,
        select: selectClause,
      });

      return books as BookInterface[];
    }

    if (variant === "LIKED") {
      const books = await db.liked_books.findMany({
        where: { profile: { full_name: fullname } },
        orderBy: orderByClause
          ? orderByClause
          : // sort by newly added
            { updated_at: defaultOrder },
        take: takeLimit,
        skip: skipItems,
        select: {
          book: {
            select: selectClause,
          },
        },
      });

      return books as BookCardInterface[];
    }

    if (variant === "OWNED") {
      const books = await db.book_owned_as.findMany({
        where: {
          profile: { full_name: fullname },
          added_audiobook_at: { not: null },
          added_book_at: { not: null },
          added_ebook_at: { not: null },
        },
        orderBy: orderByClause
          ? orderByClause
          : // sort by newly added
            [
              { added_book_at: defaultOrder },
              { added_ebook_at: defaultOrder },
              { added_audiobook_at: defaultOrder },
            ],
        take: takeLimit,
        skip: skipItems,
        select: {
          book: {
            select: selectClause,
          },
        },
      });

      return books as BookCardInterface[];
    }

    if (variant === "REVIEWS") {
      const books = await db.review.findMany({
        where: { profile: { full_name: fullname } },
        orderBy: orderByClause
          ? orderByClause
          : // sort by newly added
            [{ created_at: defaultOrder }, { updated_at: defaultOrder }],
        take: takeLimit,
        skip: skipItems,
        select: {
          book: {
            select: selectClause,
          },
        },
      });

      return books as BookReviewCardInterface[];
    }

    const books = await db.bookshelf.findMany({
      where: { bookshelf: variant, profile: { full_name: fullname } },
      orderBy: orderByClause
        ? orderByClause
        : // sort by newly added
          { updated_at: defaultOrder },
      take: takeLimit,
      skip: skipItems,
      select: {
        book: {
          select: selectClause,
        },
      },
    });

    return books as BookCardInterface[];
  } catch (error) {
    return [];
  }
}
