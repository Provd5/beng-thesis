"use server";

import { type ReadonlyURLSearchParams } from "next/navigation";

import { type GetBookInterface } from "~/types/data/book";
import {
  type BookshelfPreviewType,
  type BookshelvesTypes,
} from "~/types/data/bookshelf";
import { type ReviewInterface } from "~/types/data/review";
import { type GetDataList } from "~/types/list";
import { SortBooksArray } from "~/types/orderArrays";
import {
  type SortBookshelvesType,
  type SortReviewBookshelfType,
} from "~/types/sort";

import { sortParamsValidator } from "~/utils/sortParamsValidator";

import { db } from "../db";
import readUserSession from "../supabase/readUserSession";
import { ChangeBookshelfValidator } from "../validations/bookshelf";
import { GlobalErrors } from "../validations/errorsEnums";

export class BookshelfService {
  private itemsPerPage = 10;
  private totalPages = (allItems: number) =>
    Math.ceil(allItems / this.itemsPerPage);

  private bookshelfPreviewSelector = {
    book: {
      select: {
        id: true,
        title: true,
        authors: true,
        thumbnail_url: true,
      },
    },
  };

  private bookshelvesSelector = {
    book: {
      include: {
        _count: { select: { review: true, liked_by: true } },
        review: { select: { rate: true } },
      },
    },
  };

  async getQuantity(
    profileName: string,
    bookshelf: BookshelvesTypes
  ): Promise<number> {
    try {
      let quantity = 0;

      switch (bookshelf) {
        case "LIKED":
          quantity = await db.liked_books.count({
            where: { profile: { full_name: profileName } },
          });
          break;

        case "REVIEWS":
          quantity = await db.review.count({
            where: { profile: { full_name: profileName } },
          });
          break;

        case "OWNED":
          quantity = await db.book_owned_as.count({
            where: {
              profile: { full_name: profileName },
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
            where: { profile: { full_name: profileName }, bookshelf },
          });
          break;
      }

      return quantity;
    } catch (e) {
      throw new Error(`Error while fetching bookshelf quantity.`);
    }
  }

  async getBookshelfBooks(
    bookshelf: Exclude<BookshelvesTypes, "REVIEWS">,
    profileName: string,
    searchParams: ReadonlyURLSearchParams
  ): Promise<GetDataList<GetBookInterface>> {
    const validSearchParams = sortParamsValidator(searchParams, SortBooksArray);
    const { order, orderBy: defaultOrderBy, page } = validSearchParams;
    const orderBy = defaultOrderBy as SortBookshelvesType;

    const popularityOrder = [
      { book: { liked_by: { _count: order } } },
      { book: { review: { _count: order } } },
      { book: { book_owned_as: { _count: order } } },
      { book: { bookshelf: { _count: order } } },
    ];

    let booksPromise;

    switch (bookshelf) {
      case "LIKED":
        booksPromise = db.liked_books.findMany({
          skip: (page - 1) * this.itemsPerPage,
          take: this.itemsPerPage,
          orderBy:
            orderBy === "last_added"
              ? { updated_at: order }
              : orderBy === "popularity"
              ? popularityOrder
              : { book: { [orderBy]: order } },
          where: { profile: { full_name: profileName } },
          select: this.bookshelvesSelector,
        });
        break;

      case "OWNED":
        booksPromise = db.book_owned_as.findMany({
          skip: (page - 1) * this.itemsPerPage,
          take: this.itemsPerPage,
          orderBy:
            orderBy === "last_added"
              ? { updated_at: order }
              : orderBy === "popularity"
              ? popularityOrder
              : { book: { [orderBy]: order } },
          where: {
            profile: { full_name: profileName },
            NOT: {
              AND: [
                { added_audiobook_at: null },
                { added_book_at: null },
                { added_ebook_at: null },
              ],
            },
          },
          select: this.bookshelvesSelector,
        });
        break;

      default:
        booksPromise = db.bookshelf.findMany({
          skip: (page - 1) * this.itemsPerPage,
          take: this.itemsPerPage,
          orderBy:
            orderBy === "last_added"
              ? { updated_at: order }
              : orderBy === "popularity"
              ? popularityOrder
              : { book: { [orderBy]: order } },
          where: { profile: { full_name: profileName }, bookshelf },
          select: this.bookshelvesSelector,
        });
        break;
    }

    try {
      const [allItems, books] = await Promise.all([
        this.getQuantity(profileName, bookshelf),
        booksPromise,
      ]);

      return {
        page,
        totalPages: this.totalPages(allItems),
        allItems,
        itemsPerPage:
          books.length < this.itemsPerPage ? books.length : this.itemsPerPage,
        data: books.map(({ book }) => book),
      };
    } catch (e) {
      throw new Error(`Error while fetching bookshelf.`);
    }
  }

  async getBookshelfPreview(
    profileName: string,
    bookshelf: BookshelvesTypes
  ): Promise<
    Omit<
      GetDataList<BookshelfPreviewType>,
      "page" | "totalPages" | "itemsPerPage"
    >
  > {
    try {
      const allItems = await this.getQuantity(profileName, bookshelf);
      let books = [];

      switch (bookshelf) {
        case "LIKED":
          books = await db.liked_books.findMany({
            take: this.itemsPerPage,
            orderBy: { updated_at: "desc" },
            where: { profile: { full_name: profileName } },
            select: this.bookshelfPreviewSelector,
          });
          break;

        case "REVIEWS":
          books = await db.review.findMany({
            take: this.itemsPerPage,
            orderBy: { updated_at: "desc" },
            where: { profile: { full_name: profileName } },
            select: this.bookshelfPreviewSelector,
          });
          break;

        case "OWNED":
          books = await db.book_owned_as.findMany({
            take: this.itemsPerPage,
            orderBy: { updated_at: "desc" },
            where: {
              profile: { full_name: profileName },
              NOT: {
                AND: [
                  { added_audiobook_at: null },
                  { added_book_at: null },
                  { added_ebook_at: null },
                ],
              },
            },
            select: this.bookshelfPreviewSelector,
          });
          break;

        default:
          books = await db.bookshelf.findMany({
            take: this.itemsPerPage,
            where: { profile: { full_name: profileName }, bookshelf },
            select: this.bookshelfPreviewSelector,
          });
          break;
      }

      return {
        data: books.map(({ book }) => book),
        allItems,
      };
    } catch (e) {
      throw new Error(`Error while fetching bookshelf preview.`);
    }
  }

  async getReviewBooks(
    profileName: string,
    searchParams: ReadonlyURLSearchParams
  ): Promise<GetDataList<ReviewInterface & { book: GetBookInterface }>> {
    const validSearchParams = sortParamsValidator(searchParams, SortBooksArray);
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
        this.getQuantity(profileName, "REVIEWS"),
        db.review.findMany({
          skip: (page - 1) * this.itemsPerPage,
          take: this.itemsPerPage,
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
          where: { profile: { full_name: profileName } },
          include: this.bookshelvesSelector,
        }),
      ]);

      return {
        page,
        totalPages: Math.ceil(allItems / this.itemsPerPage),
        allItems,
        itemsPerPage:
          books.length < this.itemsPerPage ? books.length : this.itemsPerPage,
        data: books,
      };
    } catch (e) {
      throw new Error(`Error while fetching bookshelf.`);
    }
  }

  async changeBookshelf(bookId: unknown, formData: unknown): Promise<Response> {
    try {
      const {
        data: { session },
      } = await readUserSession();

      if (!session?.user) {
        throw new Error(GlobalErrors.UNAUTHORIZED);
      }

      const validData = ChangeBookshelfValidator.parse({
        bookId,
        ...{ formData },
      });

      // Filter out properties with null values
      const filteredUpsertData = Object.fromEntries(
        Object.entries(validData).filter(([_, value]) => value !== null)
      );

      await db.bookshelf.upsert({
        where: {
          user_id_book_id: {
            book_id: validData.bookId,
            user_id: session.user.id,
          },
        },
        update: {
          bookshelf: validData.bookshelf,
          ...filteredUpsertData,
        },
        create: {
          book_id: validData.bookId,
          user_id: session.user.id,
          bookshelf: validData.bookshelf,
          ...filteredUpsertData,
        },
      });

      return new Response();
    } catch (e) {
      throw new Error(`Error while changing bookshelf.`);
    }
  }
}
