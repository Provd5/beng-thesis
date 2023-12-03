"use server";

import { ownedAsArray, type OwnedAsType } from "~/types/CategoryTypes";

import { db } from "~/lib/db";
import { convertTimeToDays } from "~/utils/convertTimeToDays";

export async function fetchOwnedAsStatistics(fullname: string) {
  const getCount = async (ownedAs: OwnedAsType) => {
    switch (ownedAs) {
      case "AUDIOBOOK":
        return db.book_owned_as.count({
          where: {
            profile: { full_name: fullname },
            added_audiobook_at: { not: null },
          },
        });
      case "BOOK":
        return db.book_owned_as.count({
          where: {
            profile: { full_name: fullname },
            added_book_at: { not: null },
          },
        });
      case "EBOOK":
        return db.book_owned_as.count({
          where: {
            profile: { full_name: fullname },
            added_ebook_at: { not: null },
          },
        });
    }
  };

  const [counts, uniqueCounts] = (await Promise.all([
    Promise.all(
      ownedAsArray.map(async (type) => ({ [type]: await getCount(type) }))
    ),
    db.book_owned_as.count({
      where: {
        profile: { full_name: fullname },
        AND: {
          NOT: {
            added_audiobook_at: { not: null },
            added_book_at: { not: null },
            added_ebook_at: { not: null },
          },
        },
      },
    }),
  ])) as [{ [x in OwnedAsType]: number }[], number];

  const totalCounts = counts.reduce((acc, curr) => {
    const value = Object.values(curr)[0];
    return acc + value;
  }, 0);

  return {
    counts,
    uniqueCounts,
    totalCounts,
  };
}

export async function fetchAlreadyReadStatistics(fullname: string) {
  const commonSelect = {
    began_reading_at: true,
    updated_at: true,
    book: { select: { title: true, authors: true, page_count: true } },
  };

  const [
    alreadyReadCount,
    alreadyRead,
    recentlyRead,
    mostRead,
    mostPagesBook,
    totalReadPages,
  ] = await Promise.all([
    db.bookshelf.count({
      where: {
        profile: { full_name: fullname },
        bookshelf: "ALREADY_READ",
      },
    }),

    db.bookshelf.findMany({
      where: {
        profile: { full_name: fullname },
        bookshelf: "ALREADY_READ",
        began_reading_at: { not: null },
      },
      select: commonSelect,
    }),

    db.bookshelf.findFirst({
      orderBy: { updated_at: "desc" },
      where: {
        profile: { full_name: fullname },
        bookshelf: "ALREADY_READ",
      },
      select: commonSelect,
    }),

    db.bookshelf.findFirst({
      orderBy: { read_quantity: "desc" },
      where: {
        profile: { full_name: fullname },
        bookshelf: "ALREADY_READ",
      },
      select: { ...commonSelect, read_quantity: true },
    }),

    db.bookshelf.findFirst({
      orderBy: { book: { page_count: "desc" } },
      where: {
        profile: { full_name: fullname },
        bookshelf: "ALREADY_READ",
      },
      select: commonSelect,
    }),

    db.book.aggregate({
      where: {
        bookshelf: {
          every: {
            bookshelf: { equals: "ALREADY_READ" },
            profile: { full_name: fullname },
          },
        },
      },
      _sum: { page_count: true },
    }),
  ]);

  const readingTimeDifference =
    alreadyRead.length > 0 &&
    alreadyRead.reduce(
      (result, entry) => {
        if (
          entry.began_reading_at !== null &&
          entry.updated_at > entry.began_reading_at
        ) {
          const timeDifference =
            entry.updated_at.getTime() - entry.began_reading_at.getTime();

          if (
            timeDifference > 0 &&
            timeDifference < result.longestReadTimeDiff
          ) {
            result.longestReadTimeDiff = convertTimeToDays(timeDifference);
            result.longestReadBook = entry.book;
          }

          if (timeDifference > result.shortestReadTimeDiff) {
            result.shortestReadTimeDiff = convertTimeToDays(timeDifference);
            result.shortestReadBook = entry.book;
          }
        }
        return result;
      },
      {
        longestReadTimeDiff: Infinity,
        longestReadBook: {} as {
          title: string;
          authors: string[];
          page_count: number;
        },
        shortestReadTimeDiff: -Infinity,
        shortestReadBook: {} as {
          title: string;
          authors: string[];
          page_count: number;
        },
      }
    );

  return {
    alreadyReadCount,
    readingTimeDifference,
    recentlyRead,
    mostRead,
    mostPagesBook,
    totalReadPages,
  };
}
