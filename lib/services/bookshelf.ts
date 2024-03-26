"use server";

import { type ReadonlyURLSearchParams } from "next/navigation";

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
import readUserSession from "../supabase/readUserSession";
import { totalPages } from "../utils/totalPages";
import { transformBookData } from "../utils/transformBookData";
import { transformReviewBookshelfData } from "../utils/transformReviewBookshelfData";
import { ChangeBookshelfValidator } from "../validations/bookshelf";
import { ErrorsToTranslate } from "../validations/errorsEnums";
import { UuidValidator } from "../validations/others";

const itemsPerPage = 10;

const bookshelfPreviewSelector = {
  book: {
    select: {
      id: true,
      title: true,
      authors: true,
      thumbnail_url: true,
    },
  },
};

const bookshelvesSelector = (sessionId?: string) => {
  return {
    book: {
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
    },
  };
};

export async function getBookshelfQuantity(
  profileName: string,
  bookshelf: BookshelvesTypes
): Promise<number> {
  const decodedProfileName = decodeURIComponent(profileName);

  try {
    let quantity = 0;

    switch (bookshelf) {
      case "LIKED":
        quantity = await db.liked_books.count({
          where: { profile: { full_name: decodedProfileName } },
        });
        break;

      case "REVIEWS":
        quantity = await db.review.count({
          where: { profile: { full_name: decodedProfileName } },
        });
        break;

      case "OWNED":
        quantity = await db.book_owned_as.count({
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
        quantity = await db.bookshelf.count({
          where: { profile: { full_name: decodedProfileName }, bookshelf },
        });
        break;
    }

    return quantity;
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function getBookshelfBooks(
  bookshelf: Exclude<BookshelvesTypes, "REVIEWS">,
  profileName: string,
  searchParams: ReadonlyURLSearchParams
): Promise<GetDataList<GetBookInterface>> {
  const decodedProfileName = decodeURIComponent(profileName);

  const validSearchParams = sortParamsValidator(
    searchParams,
    SortBookshelvesArray
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
    const {
      data: { session },
    } = await readUserSession();

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
          select: bookshelvesSelector(session?.user.id),
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
          select: bookshelvesSelector(session?.user.id),
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
          select: bookshelvesSelector(session?.user.id),
        });
        break;
    }

    const [allItems, books] = await Promise.all([
      getBookshelfQuantity(decodedProfileName, bookshelf),
      booksPromise,
    ]);

    const transformedData = books.map(({ book }) =>
      transformBookData(!!session, book)
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
}

export async function getBookshelfPreview(
  profileName: string,
  bookshelf: BookshelvesTypes
): Promise<
  Omit<
    GetDataList<BookshelfPreviewType>,
    "page" | "totalPages" | "itemsPerPage"
  >
> {
  const decodedProfileName = decodeURIComponent(profileName);

  try {
    const allItems = await getBookshelfQuantity(decodedProfileName, bookshelf);
    let books = [];

    switch (bookshelf) {
      case "LIKED":
        books = await db.liked_books.findMany({
          take: itemsPerPage,
          orderBy: { updated_at: "desc" },
          where: { profile: { full_name: decodedProfileName } },
          select: bookshelfPreviewSelector,
        });
        break;

      case "REVIEWS":
        books = await db.review.findMany({
          take: itemsPerPage,
          orderBy: { updated_at: "desc" },
          where: { profile: { full_name: decodedProfileName } },
          select: bookshelfPreviewSelector,
        });
        break;

      case "OWNED":
        books = await db.book_owned_as.findMany({
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
        books = await db.bookshelf.findMany({
          take: itemsPerPage,
          where: { profile: { full_name: decodedProfileName }, bookshelf },
          select: bookshelfPreviewSelector,
        });
        break;
    }

    return {
      data: books.map(({ book }) => book),
      allItems,
    };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function getReviewBooks(
  profileName: string,
  searchParams: ReadonlyURLSearchParams
): Promise<GetDataList<GetBookInterface & { review: ReviewInterface }>> {
  const decodedProfileName = decodeURIComponent(profileName);

  const validSearchParams = sortParamsValidator(
    searchParams,
    SortReviewBookshelfArray
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
    const {
      data: { session },
    } = await readUserSession();

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
        include: bookshelvesSelector(session?.user.id),
      }),
    ]);

    const transformedData = books.map((data) =>
      transformReviewBookshelfData(!!session, data)
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
}

export async function changeBookshelf(
  bookId: unknown,
  formData: object
): Promise<{ success: boolean }> {
  try {
    const {
      data: { session },
    } = await readUserSession();

    if (!session?.user) {
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

    // Filter out properties with null values
    const filteredData = Object.fromEntries(
      Object.entries(validData).filter(
        ([key, value]) =>
          value !== undefined &&
          (key === "updated_at" || key === "began_reading_at")
      )
    );

    await db.bookshelf.upsert({
      where: {
        user_id_book_id: {
          book_id: validBookId,
          user_id: session.user.id,
        },
      },
      update: {
        bookshelf: validData.bookshelf,
        read_quantity: validQuantity,
        ...filteredData,
      },
      create: {
        book_id: validBookId,
        user_id: session.user.id,
        bookshelf: validData.bookshelf,
        read_quantity: validQuantity,
        ...filteredData,
      },
    });

    return { success: true };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}
