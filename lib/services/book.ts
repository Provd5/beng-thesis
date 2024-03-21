"use server";

import { type ReadonlyURLSearchParams } from "next/navigation";

import {
  type BookOwnedAsInterface,
  type GetBookInterface,
  type LikedBookInterface,
} from "~/types/data/book";
import { type BookshelfInterface } from "~/types/data/bookshelf";
import { type GetDataList } from "~/types/list";
import { SortBooksArray } from "~/types/orderArrays";
import { type SortBooksType } from "~/types/sort";

import { sortParamsValidator } from "~/utils/sortParamsValidator";

import { db } from "../db";
import readUserSession from "../supabase/readUserSession";
import { LikeBookValidator, OwnedAsValidator } from "../validations/book";
import { GlobalErrors } from "../validations/errorsEnums";

export class BookService {
  private itemsPerPage = 20;
  private totalPages = (allItems: number) =>
    Math.ceil(allItems / this.itemsPerPage);

  async getQuantity(q?: string): Promise<number> {
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
      throw new Error(`Error while fetching books quantity.`);
    }
  }

  async getAllBooks(
    searchParams: ReadonlyURLSearchParams,
    q?: string
  ): Promise<GetDataList<GetBookInterface>> {
    const validSearchParams = sortParamsValidator(searchParams, SortBooksArray);
    const { order, orderBy: defaultOrderBy, page } = validSearchParams;
    const orderBy = defaultOrderBy as SortBooksType;

    try {
      const [allItems, books] = await Promise.all([
        this.getQuantity(q),
        db.book.findMany({
          skip: (page - 1) * this.itemsPerPage,
          take: this.itemsPerPage,
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
          },
        }),
      ]);

      if (!(books.length > 0)) throw new Error("No books data.");

      return {
        page,
        totalPages: this.totalPages(allItems),
        allItems,
        itemsPerPage:
          books.length < this.itemsPerPage ? books.length : this.itemsPerPage,
        data: books,
      };
    } catch (e) {
      throw new Error(`Error while fetching books. ${e as string}`);
    }
  }

  async getBook(
    bookId: string
  ): Promise<{ book: GetBookInterface; averageRate: number }> {
    try {
      const [book, averageRate] = await Promise.all([
        db.book.findUnique({
          where: { id: bookId },
          include: {
            _count: { select: { review: true, liked_by: true } },
          },
        }),
        this.getAverageRate(bookId),
      ]);

      if (!book) throw new Error("No book data.");

      return { book, averageRate };
    } catch (e) {
      throw new Error(`Error while fetching book. ${e as string}`);
    }
  }

  async getAverageRate(bookId: string): Promise<number> {
    try {
      const rate = await db.review.aggregate({
        where: { id: bookId },
        _avg: { rate: true },
      });

      const roundedRate = rate._avg.rate
        ? parseFloat(rate._avg.rate.toFixed(1))
        : 0;

      return roundedRate;
    } catch (e) {
      throw new Error(`Error while fetching average rate.`);
    }
  }

  async getOwnedAsData(
    bookId: string
  ): Promise<BookOwnedAsInterface | null | undefined> {
    try {
      const {
        data: { session },
      } = await readUserSession();

      if (!session) return undefined;

      const ownedAs = await db.book_owned_as.findFirst({
        where: { profile: { id: session.user.id }, book: { id: bookId } },
      });

      return ownedAs;
    } catch (e) {
      throw new Error(`Error while fetching books.`);
    }
  }

  async getLikedData(
    bookId: string
  ): Promise<LikedBookInterface | null | undefined> {
    try {
      const {
        data: { session },
      } = await readUserSession();

      if (!session) return undefined;

      const liked = await db.liked_books.findFirst({
        where: { profile: { id: session.user.id }, book: { id: bookId } },
      });

      return liked;
    } catch (e) {
      throw new Error(`Error while fetching books.`);
    }
  }

  async getBookshelfData(
    bookId: string
  ): Promise<BookshelfInterface | null | undefined> {
    try {
      const {
        data: { session },
      } = await readUserSession();

      if (!session) return undefined;

      const bookshelf = await db.bookshelf.findFirst({
        where: { profile: { id: session.user.id }, book: { id: bookId } },
      });

      return bookshelf;
    } catch (e) {
      throw new Error(`Error while fetching books.`);
    }
  }

  async postLike(bookId: unknown): Promise<Response> {
    try {
      const {
        data: { session },
      } = await readUserSession();

      if (!session?.user) {
        throw new Error(GlobalErrors.UNAUTHORIZED);
      }

      const validBookId = LikeBookValidator.parse({ bookId });

      const alreadyLiked = await db.liked_books.count({
        where: { book_id: validBookId.bookId, user_id: session.user.id },
      });

      if (alreadyLiked) {
        await db.liked_books.delete({
          where: {
            user_id_book_id: {
              book_id: validBookId.bookId,
              user_id: session.user.id,
            },
          },
        });
      } else {
        await db.liked_books.create({
          data: { book_id: validBookId.bookId, user_id: session.user.id },
        });
      }

      // on success
      return new Response();
    } catch (error) {
      throw new Error(GlobalErrors.SOMETHING_WENT_WRONG);
    }
  }

  async postOwnedAs(bookId: unknown, ownedAs: unknown): Promise<Response> {
    try {
      const {
        data: { session },
      } = await readUserSession();

      if (!session?.user) {
        throw new Error(GlobalErrors.UNAUTHORIZED);
      }

      const validData = OwnedAsValidator.parse({ bookId, ownedAs });
      const ownedAsTypeToManage = `added_${validData.ownedAs.toLowerCase()}_at`;

      const ownedAsData = await db.book_owned_as.findFirst({
        where: { book_id: validData.bookId, user_id: session.user.id },
        select: { [ownedAsTypeToManage]: true },
      });

      const ownedAsExists =
        !!ownedAsData?.added_audiobook_at ||
        !!ownedAsData?.added_book_at ||
        !!ownedAsData?.added_ebook_at;

      await db.book_owned_as.upsert({
        where: {
          user_id_book_id: {
            book_id: validData.bookId,
            user_id: session.user.id,
          },
        },
        update: {
          [ownedAsTypeToManage]: ownedAsExists ? null : new Date(),
        },
        create: {
          book_id: validData.bookId,
          user_id: session.user.id,
          [ownedAsTypeToManage]: new Date(),
        },
      });

      // on success
      return new Response();
    } catch (error) {
      throw new Error(GlobalErrors.SOMETHING_WENT_WRONG);
    }
  }
}
