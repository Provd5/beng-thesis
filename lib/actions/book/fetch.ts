"use server";

import { unstable_noStore } from "next/cache";

import { type ReviewCardDataInterface } from "~/types/feed/ReviewCardDataInterface";

import { db } from "~/lib/db";
import readUserSession from "~/lib/supabase/readUserSession";

export async function fetchBookData(bookId: string) {
  unstable_noStore();

  const bookData = await db.book.findUnique({
    where: { id: bookId },
  });

  return bookData;
}

export async function fetchBookNumbers(bookId: string) {
  unstable_noStore();

  const [reviews, likes] = await Promise.all([
    db.review.aggregate({
      where: { book_id: bookId },
      _avg: { rate: true },
      _count: { rate: true },
    }),
    db.liked_books.count({
      where: { book_id: bookId },
    }),
  ]);

  const averageRate = reviews._avg.rate
    ? parseFloat(reviews._avg.rate.toFixed(1))
    : 0;
  const ratesCount = reviews._count.rate;

  return { averageRate, ratesCount, likes };
}

export async function fetchMyBookData(bookId: string) {
  unstable_noStore();

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

export async function fetchMyReview(bookId: string) {
  unstable_noStore();

  const {
    data: { session },
  } = await readUserSession();

  const myReview: ReviewCardDataInterface | null | undefined =
    session?.user &&
    (await db.review.findFirst({
      where: {
        book_id: bookId,
        author_id: session.user.id,
      },
      select: {
        id: true,
        rate: true,
        text: true,
        updated_at: true,
        created_at: true,
        review_reaction: true,
        profile: {
          select: {
            id: true,
            avatar_url: true,
            full_name: true,
            created_at: true,
            _count: {
              select: {
                bookshelf: {
                  where: { bookshelf: { equals: "ALREADY_READ" } },
                },
                review: true,
                liked_book: { where: { book_id: bookId } },
              },
            },
          },
        },
      },
    }));

  return myReview;
}

export async function fetchReviewReactions(reviewId: string | undefined) {
  unstable_noStore();

  const {
    data: { session },
  } = await readUserSession();

  const [OK, MEH, myReaction] = await Promise.all([
    db.review_reaction.count({
      where: {
        review_id: reviewId,
        reaction: "OK",
      },
    }),
    db.review_reaction.count({
      where: {
        review_id: reviewId,
        reaction: "MEH",
      },
    }),
    session?.user &&
      (await db.review_reaction.findFirst({
        where: {
          review_id: reviewId,
          user_id: session.user.id,
        },
        select: { reaction: true },
      })),
  ]);

  return { OK, MEH, myReaction: myReaction?.reaction };
}
