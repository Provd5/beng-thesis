"use server";

import { unstable_cache } from "next/cache";

import { type BookshelvesTypes } from "~/types/consts";
import { type GetBookInterface } from "~/types/data/book";
import { type BookshelfReviewsInterface } from "~/types/data/bookshelf";
import { type GetDataList } from "~/types/list";
import {
  SortBookshelvesArray,
  SortReviewBookshelfArray,
} from "~/types/orderArrays";
import {
  type SortBookshelvesType,
  type SortReviewBookshelfType,
} from "~/types/sort";

import { db } from "~/lib/db";
import { bookshelvesSelector } from "~/lib/utils/prismaSelectors";
import { totalPages } from "~/lib/utils/totalPages";
import { transformBookData } from "~/lib/utils/transformBookData";
import { transformReviewBookshelfData } from "~/lib/utils/transformReviewBookshelfData";
import { sortParamsValidator } from "~/utils/sortParamsValidator";

const itemsPerPage = 10;

export const getBookshelfQuantity = unstable_cache(
  async (profileName: string, bookshelf: BookshelvesTypes): Promise<number> => {
    const decodedProfileName = decodeURIComponent(profileName);

    try {
      let quantityPromise;

      switch (bookshelf) {
        case "LIKED":
          quantityPromise = db.liked_books.count({
            where: { profile: { full_name: decodedProfileName } },
          });
          break;

        case "REVIEWS":
          quantityPromise = db.review.count({
            where: { profile: { full_name: decodedProfileName } },
          });
          break;

        case "OWNED":
          quantityPromise = db.book_owned_as.count({
            where: {
              profile: { full_name: decodedProfileName },
              NOT: {
                AND: [
                  { added_audiobook_at: null },
                  { added_book_at: null },
                  { added_ebook_at: null },
                ],
              },
            },
          });
          break;

        default:
          quantityPromise = db.bookshelf.count({
            where: { profile: { full_name: decodedProfileName }, bookshelf },
          });
          break;
      }

      const quantity = await quantityPromise;

      return quantity;
    } catch (e) {
      return 0;
    }
  },
  ["bookshelf-quantity"],
  { revalidate: 60 * 60 * 2, tags: ["bookshelf-quantity"] }, // two hours
);

export const getBookshelfBooks = unstable_cache(
  async (
    sessionId: string | undefined,
    bookshelf: Exclude<BookshelvesTypes, "REVIEWS">,
    profileName: string,
    searchParams: unknown,
  ): Promise<GetDataList<GetBookInterface>> => {
    const decodedProfileName = decodeURIComponent(profileName);

    const validSearchParams = sortParamsValidator(
      searchParams,
      SortBookshelvesArray,
    );
    const { order, orderBy: defaultOrderBy, page } = validSearchParams;
    const orderBy = defaultOrderBy as SortBookshelvesType;

    const popularityOrder = [
      { book: { liked_by: { _count: order } } },
      { book: { review: { _count: order } } },
      { book: { book_owned_as: { _count: order } } },
      { book: { bookshelf: { _count: order } } },
    ];
    try {
      let booksPromise;

      switch (bookshelf) {
        case "LIKED":
          booksPromise = db.liked_books.findMany({
            skip: (page - 1) * itemsPerPage,
            take: itemsPerPage,
            orderBy:
              orderBy === "last_added"
                ? { updated_at: order }
                : orderBy === "popularity"
                  ? popularityOrder
                  : { book: { [orderBy]: order } },
            where: { profile: { full_name: decodedProfileName } },
            select: bookshelvesSelector(sessionId),
          });
          break;

        case "OWNED":
          booksPromise = db.book_owned_as.findMany({
            skip: (page - 1) * itemsPerPage,
            take: itemsPerPage,
            orderBy:
              orderBy === "last_added"
                ? { updated_at: order }
                : orderBy === "popularity"
                  ? popularityOrder
                  : { book: { [orderBy]: order } },
            where: {
              profile: { full_name: decodedProfileName },
              NOT: {
                AND: [
                  { added_audiobook_at: null },
                  { added_book_at: null },
                  { added_ebook_at: null },
                ],
              },
            },
            select: bookshelvesSelector(sessionId),
          });
          break;

        default:
          booksPromise = db.bookshelf.findMany({
            skip: (page - 1) * itemsPerPage,
            take: itemsPerPage,
            orderBy:
              orderBy === "last_added"
                ? { updated_at: order }
                : orderBy === "popularity"
                  ? popularityOrder
                  : { book: { [orderBy]: order } },
            where: { profile: { full_name: decodedProfileName }, bookshelf },
            select: bookshelvesSelector(sessionId),
          });
          break;
      }

      const [allItems, books] = await Promise.all([
        getBookshelfQuantity(decodedProfileName, bookshelf),
        booksPromise,
      ]);

      const transformedData = books.map(({ book }) =>
        transformBookData(sessionId, book),
      );

      return {
        page,
        totalPages: totalPages(allItems, itemsPerPage),
        allItems,
        itemsPerPage: books.length < itemsPerPage ? books.length : itemsPerPage,
        data: transformedData,
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
  ["bookshelf-books"],
  { revalidate: 60 * 60 * 2, tags: ["bookshelf-books"] }, // two hours
);

export const getReviewBooks = unstable_cache(
  async (
    sessionId: string | undefined,
    profileName: string,
    searchParams: unknown,
  ): Promise<GetDataList<BookshelfReviewsInterface>> => {
    const decodedProfileName = decodeURIComponent(profileName);

    const validSearchParams = sortParamsValidator(
      searchParams,
      SortReviewBookshelfArray,
    );
    const { order, orderBy: defaultOrderBy, page } = validSearchParams;
    const orderBy = defaultOrderBy as SortReviewBookshelfType;

    const popularityOrder = [
      { book: { liked_by: { _count: order } } },
      { book: { review: { _count: order } } },
      { book: { book_owned_as: { _count: order } } },
      { book: { bookshelf: { _count: order } } },
    ];

    try {
      const [allItems, books] = await Promise.all([
        getBookshelfQuantity(decodedProfileName, "REVIEWS"),
        db.review.findMany({
          skip: (page - 1) * itemsPerPage,
          take: itemsPerPage,
          orderBy:
            orderBy === "last_added"
              ? { updated_at: order }
              : orderBy === "popularity"
                ? popularityOrder
                : orderBy === "reactions"
                  ? { review_reaction: { _count: order } }
                  : orderBy === "rate"
                    ? { rate: order }
                    : { book: { [orderBy]: order } },
          where: { profile: { full_name: decodedProfileName } },
          include: {
            ...bookshelvesSelector(sessionId),
            review_reaction: { select: { reaction: true } },
          },
        }),
      ]);

      const transformedData = books.map((data) =>
        transformReviewBookshelfData(!!sessionId, data),
      );

      return {
        page,
        totalPages: totalPages(allItems, itemsPerPage),
        allItems,
        itemsPerPage: books.length < itemsPerPage ? books.length : itemsPerPage,
        data: transformedData,
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
  ["review-books"],
  { revalidate: 60 * 60 * 2, tags: ["review-books"] }, // two hours
);
