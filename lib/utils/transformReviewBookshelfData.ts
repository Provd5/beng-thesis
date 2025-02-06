import { type reactionType } from "@prisma/client";

import { type RawGetBookData } from "~/types/data/book";
import { type ReviewInterface } from "~/types/data/review";

export const transformReviewBookshelfData = (
  isSession: boolean,
  data: ReviewInterface & { book: RawGetBookData } & {
    review_reaction: { reaction: reactionType }[];
  },
) => {
  const _avg_rate = parseFloat(
    (data.book.review.length > 0
      ? data.book.review.reduce(
          (accumulator, currentValue) => accumulator + currentValue.rate,
          0,
        ) / data.book.review.length
      : 0
    ).toFixed(1),
  );

  const reviewKeys = Object.keys(data).filter(
    (key) => !["book"].includes(key),
  ) as (keyof ReviewInterface)[];

  const review = reviewKeys.map((key) => {
    return { [key]: data[key] };
  });

  const bookKeys = Object.keys(data.book).filter(
    (key) =>
      !["_count", "review", "book_owned_as", "bookshelf", "liked_by"].includes(
        key,
      ),
  ) as (keyof Omit<
    RawGetBookData,
    "_count" | "review" | "book_owned_as" | "bookshelf" | "liked_by"
  >)[];

  const book = bookKeys.map((key) => {
    return { [key]: data.book[key] };
  });

  const reviewData = Object.assign({}, ...review) as ReviewInterface;
  const bookData = Object.assign({}, ...book) as Omit<
    RawGetBookData,
    "_count" | "review" | "book_owned_as" | "bookshelf" | "liked_by"
  >;

  const transformedData = {
    review_reaction: data.review_reaction,
    review: reviewData,
    book: bookData,
    _count: data.book._count,
    _avg_rate,
    book_owned_as: isSession
      ? data.book.book_owned_as.length > 0
        ? data.book.book_owned_as[0]
        : null
      : undefined,
    bookshelf: isSession
      ? data.book.bookshelf.length > 0
        ? data.book.bookshelf[0]
        : null
      : undefined,
    liked_by: isSession
      ? data.book.liked_by.length > 0
        ? data.book.liked_by[0]
        : null
      : undefined,
  };

  return transformedData;
};
