"use server";

import { revalidateTag } from "next/cache";

import { type BookshelvesTypes } from "~/types/consts";
import { type GetBookInterface } from "~/types/data/book";
import { type BookshelfPreviewType } from "~/types/data/bookshelf";
import { type ReviewInterface } from "~/types/data/review";
import { type GetDataList } from "~/types/list";
import {
  SortBookshelvesArray,
  SortReviewBookshelfArray,
} from "~/types/orderArrays";
import {
  type SortBookshelvesType,
  type SortReviewBookshelfType,
} from "~/types/sort";

import { sortParamsValidator } from "~/utils/sortParamsValidator";

import { db } from "../db";
import { errorHandler } from "../errorHandler";
import { unstable_cache } from "../unstable-cache";
import {
  bookshelfPreviewSelector,
  bookshelvesSelector,
} from "../utils/prismaSelectors";
import { totalPages } from "../utils/totalPages";
import { transformBookData } from "../utils/transformBookData";
import { transformReviewBookshelfData } from "../utils/transformReviewBookshelfData";
import { ChangeBookshelfValidator } from "../validations/bookshelf";
import { ErrorsToTranslate } from "../validations/errorsEnums";
import { UuidValidator } from "../validations/others";
import { getSessionUser } from "./session";

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
      throw new Error(errorHandler(e));
    }
  },
  ["bookshelf-quantity"],
  { revalidate: 60 * 60 * 2 }, // two hours
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
  ["bookshelf-books"],
  { revalidate: 60 * 60 * 2 }, // two hours
);

export const getBookshelfPreview = unstable_cache(
  async (
    profileName: string,
    bookshelf: BookshelvesTypes,
  ): Promise<
    Omit<
      GetDataList<BookshelfPreviewType>,
      "page" | "totalPages" | "itemsPerPage"
    >
  > => {
    const decodedProfileName = decodeURIComponent(profileName);

    try {
      let booksPromise;

      switch (bookshelf) {
        case "LIKED":
          booksPromise = db.liked_books.findMany({
            take: itemsPerPage,
            orderBy: { updated_at: "desc" },
            where: { profile: { full_name: decodedProfileName } },
            select: bookshelfPreviewSelector,
          });
          break;

        case "REVIEWS":
          booksPromise = db.review.findMany({
            take: itemsPerPage,
            orderBy: { updated_at: "desc" },
            where: { profile: { full_name: decodedProfileName } },
            select: bookshelfPreviewSelector,
          });
          break;

        case "OWNED":
          booksPromise = db.book_owned_as.findMany({
            take: itemsPerPage,
            orderBy: { updated_at: "desc" },
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
            select: bookshelfPreviewSelector,
          });
          break;

        default:
          booksPromise = db.bookshelf.findMany({
            take: itemsPerPage,
            where: { profile: { full_name: decodedProfileName }, bookshelf },
            select: bookshelfPreviewSelector,
          });
          break;
      }

      const [allItems, books] = await Promise.all([
        getBookshelfQuantity(decodedProfileName, bookshelf),
        booksPromise,
      ]);

      return {
        data: books.map(({ book }) => book),
        allItems,
      };
    } catch (e) {
      throw new Error(errorHandler(e));
    }
  },
  ["bookshelf-preview"],
  { revalidate: 60 * 60 * 2 }, // two hours
);

export const getReviewBooks = unstable_cache(
  async (
    sessionId: string | undefined,
    profileName: string,
    searchParams: unknown,
  ): Promise<GetDataList<GetBookInterface & { review: ReviewInterface }>> => {
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
          include: bookshelvesSelector(sessionId),
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
      throw new Error(errorHandler(e));
    }
  },
  ["review-books"],
  { revalidate: 60 * 60 * 2 }, // two hours
);

export async function changeBookshelf(
  bookId: unknown,
  formData: unknown,
): Promise<{ success: boolean }> {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      throw new Error(ErrorsToTranslate.UNAUTHORIZED);
    }

    const validBookId = UuidValidator.parse(bookId);
    const validData = ChangeBookshelfValidator.parse(formData);

    const validQuantity =
      validData.bookshelf === "ALREADY_READ" && !!validData.read_quantity
        ? validData.read_quantity > 1
          ? validData.read_quantity
          : 1
        : undefined;

    await db.bookshelf.upsert({
      where: {
        user_id_book_id: {
          book_id: validBookId,
          user_id: sessionUser.id,
        },
      },
      update: {
        bookshelf: validData.bookshelf,
        read_quantity: validQuantity,
        updated_at: validData.updated_at,
        began_reading_at: validData.began_reading_at,
      },
      create: {
        book_id: validBookId,
        user_id: sessionUser.id,
        bookshelf: validData.bookshelf,
        read_quantity: validQuantity,
        updated_at: validData.updated_at,
        began_reading_at: validData.began_reading_at,
      },
    });

    // on success
    revalidateTag("session-user");
    return { success: true };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}
