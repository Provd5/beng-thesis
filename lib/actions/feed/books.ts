"use server";

import { unstable_noStore } from "next/cache";
import { z } from "zod";

import { type CategoryTypes } from "~/types/CategoryTypes";
import {
  BOOKS_FEED_TAKE_LIMIT,
  PROFILE_PAGE_BOOKS_TAKE_LIMIT,
} from "~/types/feed/TakeLimits";

import { db } from "~/lib/db";

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
  q: z.string().min(2).nullish(),
});

export async function fetchBooks(
  variant: CategoryTypes | null,
  fullname: string | null,
  searchParams:
    | {
        orderBy?: string;
        order?: "asc" | "desc";
        page?: string;
        q?: string;
      }
    | undefined
): Promise<BookCardInterface[] | BookInterface[] | BookReviewCardInterface[]> {
  unstable_noStore();

  try {
    const { orderBy, order, page, q } = ParamsValidator.parse(searchParams);

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
          };

    if (!variant || variant === "STATISTICS") {
      const books = await db.book.findMany({
        where: q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                {
                  description: { contains: q, mode: "insensitive" },
                },
                { subtitle: { contains: q, mode: "insensitive" } },
                { authors: { has: q } },
                { isbn_10: { equals: q } },
                { isbn_13: { equals: q } },
              ],
            }
          : {},
        orderBy: allBooksOrderByClause,
        take: takeLimit,
        skip: skipItems,
        select: selectClause,
      });

      return books as BookInterface[];
    }

    if (variant === "LIKED") {
      const books = await db.liked_books.findMany({
        where: {
          profile: { full_name: fullname },
          ...(q
            ? {
                book: {
                  OR: [
                    { title: { contains: q, mode: "insensitive" } },
                    {
                      description: { contains: q, mode: "insensitive" },
                    },
                    { subtitle: { contains: q, mode: "insensitive" } },
                    { authors: { has: q } },
                    { isbn_10: { equals: q } },
                    { isbn_13: { equals: q } },
                  ],
                },
              }
            : {}),
        },
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
          ...(q
            ? {
                book: {
                  OR: [
                    { title: { contains: q, mode: "insensitive" } },
                    {
                      description: { contains: q, mode: "insensitive" },
                    },
                    { subtitle: { contains: q, mode: "insensitive" } },
                    { authors: { has: q } },
                    { isbn_10: { equals: q } },
                    { isbn_13: { equals: q } },
                  ],
                },
              }
            : {}),
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
        where: {
          profile: { full_name: fullname },
          ...(q
            ? {
                book: {
                  OR: [
                    { title: { contains: q, mode: "insensitive" } },
                    {
                      description: { contains: q, mode: "insensitive" },
                    },
                    { subtitle: { contains: q, mode: "insensitive" } },
                    { authors: { has: q } },
                    { isbn_10: { equals: q } },
                    { isbn_13: { equals: q } },
                  ],
                },
              }
            : {}),
        },
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

export async function fetchBooksInCategoryCount(
  type: CategoryTypes | null,
  fullname: string | null,
  searchParams?: {
    q?: string;
  }
): Promise<number> {
  unstable_noStore();

  try {
    const q = searchParams ? ParamsValidator.parse(searchParams).q : undefined;

    const getCount = async (category: CategoryTypes | null) => {
      switch (category) {
        case "STATISTICS":
          return 0;
        case null:
          return db.book.count({
            where: q
              ? {
                  OR: [
                    { title: { contains: q, mode: "insensitive" } },
                    {
                      description: { contains: q, mode: "insensitive" },
                    },
                    { subtitle: { contains: q, mode: "insensitive" } },
                    { authors: { has: q } },
                    { isbn_10: { equals: q } },
                    { isbn_13: { equals: q } },
                  ],
                }
              : {},
          });
        case "LIKED":
          return db.liked_books.count({
            where: {
              profile: { full_name: fullname },
              ...(q
                ? {
                    book: {
                      OR: [
                        { title: { contains: q, mode: "insensitive" } },
                        {
                          description: { contains: q, mode: "insensitive" },
                        },
                        { subtitle: { contains: q, mode: "insensitive" } },
                        { authors: { has: q } },
                        { isbn_10: { equals: q } },
                        { isbn_13: { equals: q } },
                      ],
                    },
                  }
                : {}),
            },
          });
        case "REVIEWS":
          return db.review.count({
            where: {
              profile: { full_name: fullname },
              ...(q
                ? {
                    book: {
                      OR: [
                        { title: { contains: q, mode: "insensitive" } },
                        {
                          description: { contains: q, mode: "insensitive" },
                        },
                        { subtitle: { contains: q, mode: "insensitive" } },
                        { authors: { has: q } },
                        { isbn_10: { equals: q } },
                        { isbn_13: { equals: q } },
                      ],
                    },
                  }
                : {}),
            },
          });
        case "OWNED":
          return db.book_owned_as.count({
            where: {
              profile: { full_name: fullname },
              added_audiobook_at: { not: null },
              added_book_at: { not: null },
              added_ebook_at: { not: null },
              ...(q
                ? {
                    book: {
                      OR: [
                        { title: { contains: q, mode: "insensitive" } },
                        {
                          description: { contains: q, mode: "insensitive" },
                        },
                        { subtitle: { contains: q, mode: "insensitive" } },
                        { authors: { has: q } },
                        { isbn_10: { equals: q } },
                        { isbn_13: { equals: q } },
                      ],
                    },
                  }
                : {}),
            },
          });
        default:
          return db.bookshelf.count({
            where: {
              profile: { full_name: fullname },
              bookshelf: category,
              ...(q
                ? {
                    book: {
                      OR: [
                        { title: { contains: q, mode: "insensitive" } },
                        {
                          description: { contains: q, mode: "insensitive" },
                        },
                        { subtitle: { contains: q, mode: "insensitive" } },
                        { authors: { has: q } },
                        { isbn_10: { equals: q } },
                        { isbn_13: { equals: q } },
                      ],
                    },
                  }
                : {}),
            },
          });
      }
    };

    const booksCount = await getCount(type);
    return booksCount;
  } catch (error) {
    return 0;
  }
}
