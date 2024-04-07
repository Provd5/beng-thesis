"use server";

import {
  type BookshelfQuantitiesInterface,
  type OwnedBooksInterface,
  type ReadBooksInterface,
} from "~/types/data/statistics";

import { db } from "../db";
import { errorHandler } from "../errorHandler";
import { bookshelfPreviewSelector } from "../utils/bookshelvesSelector";
import { getBookshelfQuantity } from "./bookshelf";

export async function getAllBookshelvesQuantity(
  profileName: string
): Promise<BookshelfQuantitiesInterface> {
  const decodedProfileName = decodeURIComponent(profileName);

  try {
    const otherBookshelvesPromise = db.profile.findUnique({
      where: { full_name: decodedProfileName },
      select: {
        _count: {
          select: {
            bookshelf: { where: { bookshelf: "OTHER" } },
            book_owned_as: {
              where: {
                NOT: {
                  AND: [
                    { added_audiobook_at: null },
                    { added_book_at: null },
                    { added_ebook_at: null },
                  ],
                },
              },
            },
            liked_book: true,
            review: true,
          },
        },
      },
    });

    const [abandoned, already_read, reading, to_read, others] =
      await Promise.all([
        getBookshelfQuantity(profileName, "ABANDONED"),
        getBookshelfQuantity(profileName, "ALREADY_READ"),
        getBookshelfQuantity(profileName, "READING"),
        getBookshelfQuantity(profileName, "TO_READ"),
        otherBookshelvesPromise,
      ]);

    return {
      book_owned_as: others?._count.book_owned_as || 0,
      liked_book: others?._count.liked_book || 0,
      review: others?._count.review || 0,
      abandoned,
      already_read,
      reading,
      to_read,
      other: others?._count.bookshelf || 0,
    };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function getOwnedStatistics(
  profileName: string
): Promise<OwnedBooksInterface> {
  const decodedProfileName = decodeURIComponent(profileName);

  try {
    const lastAddedPromise = db.book_owned_as.findFirst({
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
      select: { updated_at: true, ...bookshelfPreviewSelector },
    });

    const totalOwnedBooksPromise = db.book_owned_as.count({
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

    const [lastAdded, totalOwnedBooks] = await Promise.all([
      lastAddedPromise,
      totalOwnedBooksPromise,
    ]);

    return {
      lastAdded: lastAdded?.book || null,
      updatedAt: lastAdded?.updated_at || null,
      totalOwnedBooks,
    };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function getReadStatistics(
  profileName: string
): Promise<ReadBooksInterface> {
  const decodedProfileName = decodeURIComponent(profileName);

  try {
    const lastReadPromise = db.bookshelf.findFirst({
      orderBy: { updated_at: "desc" },
      where: {
        profile: { full_name: decodedProfileName },
        bookshelf: "ALREADY_READ",
      },
      select: { updated_at: true, ...bookshelfPreviewSelector },
    });

    const mostReadPromise = db.bookshelf.findFirst({
      orderBy: { read_quantity: "desc" },
      where: {
        profile: { full_name: decodedProfileName },
        bookshelf: "ALREADY_READ",
      },
      select: { read_quantity: true, ...bookshelfPreviewSelector },
    });

    const totalReadPromise = db.bookshelf.count({
      where: {
        profile: { full_name: decodedProfileName },
        bookshelf: "ALREADY_READ",
      },
    });

    const totalReadPagesPromise = db.book.aggregate({
      where: {
        bookshelf: {
          every: {
            profile: { full_name: decodedProfileName },
            bookshelf: "ALREADY_READ",
          },
        },
      },
      _sum: { page_count: true },
    });

    const [lastRead, mostRead, totalRead, totalReadPages] = await Promise.all([
      lastReadPromise,
      mostReadPromise,
      totalReadPromise,
      totalReadPagesPromise,
    ]);

    return {
      lastRead: lastRead?.book || null,
      mostRead,
      totalRead,
      totalReadPages: totalReadPages._sum.page_count || 0,
      updatedAt: lastRead?.updated_at || null,
    };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}
