"use server";

import { type CategoryTypes } from "~/types/CategoryTypes";

import { db } from "~/lib/db";

export async function fetchBooksCount(
  variant: CategoryTypes | null,
  fullname: string | null
): Promise<number> {
  try {
    if (!variant || variant === "STATISTICS") {
      const booksCount = await db.book.count();

      return booksCount;
    }

    if (variant === "LIKED") {
      const booksCount = await db.liked_books.count({
        where: { profile: { full_name: fullname } },
      });

      return booksCount;
    }

    if (variant === "OWNED") {
      const booksCount = await db.book_owned_as.count({
        where: {
          profile: { full_name: fullname },
          added_audiobook_at: { not: null },
          added_book_at: { not: null },
          added_ebook_at: { not: null },
        },
      });

      return booksCount;
    }

    if (variant === "REVIEWS") {
      const booksCount = await db.review.count({
        where: { profile: { full_name: fullname } },
      });

      return booksCount;
    }

    const booksCount = await db.bookshelf.count({
      where: { bookshelf: variant, profile: { full_name: fullname } },
    });

    return booksCount;
  } catch (error) {
    return 0;
  }
}
