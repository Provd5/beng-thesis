"use server";

import { revalidatePath } from "next/cache";

import { type GetBookInterface } from "~/types/data/book";
import { type BookshelfPreviewType } from "~/types/data/bookshelf";
import { type GetDataList } from "~/types/list";
import { SortBooksArray } from "~/types/orderArrays";
import { type SortBooksType } from "~/types/sort";

import ROUTES from "~/utils/routes";
import { sortParamsValidator } from "~/utils/sortParamsValidator";

import { db } from "../db";
import { errorHandler } from "../errorHandler";
import readUserSession from "../supabase/readUserSession";
import { bookshelfPreviewSelector } from "../utils/bookshelvesSelector";
import { totalPages } from "../utils/totalPages";
import { transformBookData } from "../utils/transformBookData";
import { OwnedAsValidator } from "../validations/book";
import { ErrorsToTranslate } from "../validations/errorsEnums";
import { UuidValidator } from "../validations/others";

const itemsPerPage = 20;

export async function getBookQuantity(q?: string): Promise<number> {
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
}

export async function getAllBooks(
  searchParams: unknown,
  q?: string
): Promise<GetDataList<GetBookInterface>> {
  const validSearchParams = sortParamsValidator(searchParams, SortBooksArray);
  const { order, orderBy: defaultOrderBy, page } = validSearchParams;
  const orderBy = defaultOrderBy as SortBooksType;

  try {
    const {
      data: { session },
    } = await readUserSession();

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
          ...(session
            ? {
                book_owned_as: {
                  where: { profile: { id: session.user.id } },
                },
                bookshelf: {
                  where: { profile: { id: session.user.id } },
                },
                liked_by: {
                  where: { profile: { id: session.user.id } },
                },
              }
            : {}),
        },
      }),
    ]);

    const transformedData = books.map((book) =>
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

export async function getBook(
  bookId: string
): Promise<GetBookInterface | null> {
  try {
    const validBookId = UuidValidator.parse(bookId);

    const {
      data: { session },
    } = await readUserSession();

    const bookData = await db.book.findUnique({
      where: { id: validBookId },
      include: {
        _count: { select: { review: true, liked_by: true } },
        review: { where: { book_id: validBookId }, select: { rate: true } },
        ...(session
          ? {
              book_owned_as: {
                where: {
                  profile: { id: session.user.id },
                  book_id: validBookId,
                },
              },
              bookshelf: {
                where: {
                  profile: { id: session.user.id },
                  book_id: validBookId,
                },
              },
              liked_by: {
                where: {
                  profile: { id: session.user.id },
                  book_id: validBookId,
                },
              },
            }
          : {}),
      },
    });

    if (!bookData) return null;

    const transformedData = transformBookData(!!session, bookData);

    return transformedData;
  } catch (e) {
    throw new Error(errorHandler(e));
  } finally {
  }
}

export async function getBookPreview(
  bookId: string
): Promise<BookshelfPreviewType | null> {
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
}

export async function postLike(bookId: unknown): Promise<{ success: boolean }> {
  try {
    const {
      data: { session },
    } = await readUserSession();

    if (!session?.user) {
      throw new Error(ErrorsToTranslate.UNAUTHORIZED);
    }

    const validBookId = UuidValidator.parse(bookId);

    const alreadyLiked = await db.liked_books.count({
      where: { book_id: validBookId, user_id: session.user.id },
    });

    if (alreadyLiked) {
      await db.liked_books.delete({
        where: {
          user_id_book_id: {
            book_id: validBookId,
            user_id: session.user.id,
          },
        },
      });
    } else {
      await db.liked_books.create({
        data: { book_id: validBookId, user_id: session.user.id },
      });
    }

    // on success
    revalidatePath(ROUTES.profile.session_profile, "page");
    return { success: true };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function postOwnedAs(
  bookId: unknown,
  ownedAs: unknown
): Promise<{ success: boolean }> {
  try {
    const {
      data: { session },
    } = await readUserSession();

    if (!session?.user) {
      throw new Error(ErrorsToTranslate.UNAUTHORIZED);
    }

    const validBookId = UuidValidator.parse(bookId);
    const validData = OwnedAsValidator.parse(ownedAs);
    const ownedAsTypeToManage = `added_${validData.toLowerCase()}_at`;

    const ownedAsData = await db.book_owned_as.findFirst({
      where: { book_id: validBookId, user_id: session.user.id },
      select: { [ownedAsTypeToManage]: true },
    });

    const ownedAsExists =
      !!ownedAsData?.added_audiobook_at ||
      !!ownedAsData?.added_book_at ||
      !!ownedAsData?.added_ebook_at;

    await db.book_owned_as.upsert({
      where: {
        user_id_book_id: {
          book_id: validBookId,
          user_id: session.user.id,
        },
      },
      update: {
        [ownedAsTypeToManage]: ownedAsExists ? null : new Date(),
      },
      create: {
        book_id: validBookId,
        user_id: session.user.id,
        [ownedAsTypeToManage]: new Date(),
      },
    });

    // on success
    revalidatePath(ROUTES.profile.session_profile, "page");
    return { success: true };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}
