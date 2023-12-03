"use server";

import { db } from "~/lib/db";
import readUserSession from "~/lib/supabase/readUserSession";

export async function fetchBookData(bookId: string) {
  const [bookData, bookAvgRate] = await Promise.all([
    db.book.findUnique({
      where: { id: bookId },
      include: {
        _count: { select: { liked_by: true } },
      },
    }),

    db.review.aggregate({
      where: { book_id: bookId },
      _avg: { rate: true },
      _count: { rate: true },
    }),
  ]);

  return { bookData, bookAvgRate };
}

export async function fetchMyBookData(bookId: string) {
  const {
    data: { session },
  } = await readUserSession();

  if (!session?.user) return;

  const [myBookshelfData, myOwnedAsData, myReviewData, myLike] =
    await Promise.all([
      db.bookshelf.findFirst({
        where: { profile: { id: session.user.id }, book: { id: bookId } },
        select: {
          bookshelf: true,
          updated_at: true,
          began_reading_at: true,
          read_quantity: true,
        },
      }),
      db.book_owned_as.findFirst({
        where: { profile: { id: session.user.id }, book: { id: bookId } },
        select: {
          added_audiobook_at: true,
          added_book_at: true,
          added_ebook_at: true,
        },
      }),
      db.review.findFirst({
        where: { profile: { id: session.user.id }, book: { id: bookId } },
        select: { created_at: true },
      }),
      db.liked_books.count({
        where: { profile: { id: session.user.id }, book: { id: bookId } },
      }),
    ]);

  const doILikeThisBook = !!myLike && myLike > 0;

  return {
    myBookshelfData,
    myOwnedAsData,
    myReviewData,
    doILikeThisBook,
  };
}
