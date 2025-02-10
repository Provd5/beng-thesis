"use server";

import { type QueryResponseType } from "~/types/actions";
import {
  type BookshelfQuantitiesInterface,
  type OwnedBooksInterface,
  type ReadBooksInterface,
} from "~/types/data/statistics";

import { db } from "~/lib/db";
import { errorHandler } from "~/lib/errorHandler";
import { bookshelfPreviewSelector } from "~/lib/utils/prismaSelectors";

import { getBookshelfQuantity } from "../bookshelf/queries";

export async function getAllBookshelvesQuantity(
  profileName: string,
): QueryResponseType<BookshelfQuantitiesInterface> {
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
      data: {
        book_owned_as: others?._count.book_owned_as || 0,
        liked_book: others?._count.liked_book || 0,
        review: others?._count.review || 0,
        abandoned,
        already_read,
        reading,
        to_read,
        other: others?._count.bookshelf || 0,
      },
    };
  } catch (e) {
    return { error: errorHandler(e) };
  }
}

export async function getOwnedStatistics(
  profileName: string,
): QueryResponseType<OwnedBooksInterface> {
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
      data: {
        lastAdded: lastAdded?.book || null,
        updatedAt: lastAdded?.updated_at || null,
        totalOwnedBooks,
      },
    };
  } catch (e) {
    return { error: errorHandler(e) };
  }
}

export async function getReadStatistics(
  profileName: string,
): QueryResponseType<ReadBooksInterface> {
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
      data: {
        lastRead: lastRead?.book || null,
        mostRead,
        totalRead,
        totalReadPages: totalReadPages._sum.page_count || 0,
        updatedAt: lastRead?.updated_at || null,
      },
    };
  } catch (e) {
    return { error: errorHandler(e) };
  }
}
