"use server";

import { unstable_cache } from "next/cache";

import { type GetBookInterface } from "~/types/data/book";
import { type BookshelfPreviewType } from "~/types/data/bookshelf";
import { type GetDataList } from "~/types/list";
import { SortBooksArray } from "~/types/orderArrays";
import { type SortBooksType } from "~/types/sort";

import { db } from "~/lib/db";
import { errorHandler } from "~/lib/errorHandler";
import { bookshelfPreviewSelector } from "~/lib/utils/prismaSelectors";
import { totalPages } from "~/lib/utils/totalPages";
import { transformBookData } from "~/lib/utils/transformBookData";
import { UuidValidator } from "~/lib/validations/others";
import { sortParamsValidator } from "~/utils/sortParamsValidator";

const itemsPerPage = 20;

export const getBookQuantity = unstable_cache(
  async (q?: string): Promise<number> => {
    try {
      const quantity = await db.book.count({
        where: {
          ...(q
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
            : {}),
        },
      });

      return quantity;
    } catch (e) {
      throw new Error(errorHandler(e));
    }
  },
  ["book-quantity"],
  { revalidate: 60 * 60 * 2, tags: ["book-quantity"] }, // two hours
);

export const getAllBooks = unstable_cache(
  async (
    sessionId: string | undefined,
    searchParams: unknown,
    q?: string,
  ): Promise<GetDataList<GetBookInterface>> => {
    const validSearchParams = sortParamsValidator(searchParams, SortBooksArray);
    const { order, orderBy: defaultOrderBy, page } = validSearchParams;
    const orderBy = defaultOrderBy as SortBooksType;

    try {
      const [allItems, books] = await Promise.all([
        getBookQuantity(q),
        db.book.findMany({
          skip: (page - 1) * itemsPerPage,
          take: itemsPerPage,
          where: {
            ...(q
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
              : {}),
          },
          orderBy:
            orderBy === "popularity"
              ? [
                  { liked_by: { _count: order } },
                  { review: { _count: order } },
                  { book_owned_as: { _count: order } },
                  { bookshelf: { _count: order } },
                ]
              : { [orderBy]: order },
          include: {
            _count: { select: { review: true, liked_by: true } },
            review: { select: { rate: true } },
            ...(sessionId
              ? {
                  book_owned_as: {
                    where: { profile: { id: sessionId } },
                  },
                  bookshelf: {
                    where: { profile: { id: sessionId } },
                  },
                  liked_by: {
                    where: { profile: { id: sessionId } },
                  },
                }
              : {}),
          },
        }),
      ]);

      const transformedData = books.map((book) =>
        transformBookData(!!sessionId, book),
      );

      return {
        page,
        totalPages: totalPages(allItems, itemsPerPage),
        allItems,
        itemsPerPage: books.length < itemsPerPage ? books.length : itemsPerPage,
        data: transformedData,
      };
    } catch (e) {
      throw new Error(errorHandler(e));
    }
  },
  ["all-books"],
  { revalidate: 60 * 60 * 2, tags: ["all-books"] }, // two hours
);

export const getBook = unstable_cache(
  async (
    sessionId: string | undefined,
    bookId: string,
  ): Promise<GetBookInterface | null> => {
    try {
      const validBookId = UuidValidator.parse(bookId);

      const bookData = await db.book.findUnique({
        where: { id: validBookId },
        include: {
          _count: { select: { review: true, liked_by: true } },
          review: { where: { book_id: validBookId }, select: { rate: true } },
          ...(sessionId
            ? {
                book_owned_as: {
                  where: {
                    profile: { id: sessionId },
                    book_id: validBookId,
                  },
                },
                bookshelf: {
                  where: {
                    profile: { id: sessionId },
                    book_id: validBookId,
                  },
                },
                liked_by: {
                  where: {
                    profile: { id: sessionId },
                    book_id: validBookId,
                  },
                },
              }
            : {}),
        },
      });

      if (!bookData) return null;

      const transformedData = transformBookData(!!sessionId, bookData);

      return transformedData;
    } catch (e) {
      throw new Error(errorHandler(e));
    } finally {
    }
  },
  ["book"],
  { revalidate: 60 * 60 * 2, tags: ["book"] }, // two hours
);

export const getBookPreview = unstable_cache(
  async (bookId: string): Promise<BookshelfPreviewType | null> => {
    try {
      const validBookId = UuidValidator.parse(bookId);

      const bookData = await db.book.findUnique({
        where: { id: validBookId },
        select: bookshelfPreviewSelector.book.select,
      });

      if (!bookData) return null;

      return bookData;
    } catch (e) {
      throw new Error(errorHandler(e));
    } finally {
    }
  },
  ["book-preview"],
  { revalidate: 60 * 60 * 2, tags: ["book-preview"] }, // two hours
);
