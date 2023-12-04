import { type FC } from "react";

import { type CategoryTypes } from "~/types/CategoryTypes";

import { fetchBooks } from "~/lib/actions/feed/books";

import { BookCard } from "../Explore/BookCard";
import { BookReviewCard } from "../Explore/BookReviewCard";

interface BooksFeedProps {
  variant: CategoryTypes | null;
  fullname: string | null;
  searchParams:
    | {
        orderBy?: string;
        order?: "asc" | "desc";
        page?: string;
      }
    | undefined;
}

export const BooksFeed: FC<BooksFeedProps> = async ({
  variant,
  fullname,
  searchParams,
}) => {
  const books = await fetchBooks(variant, fullname, searchParams);

  return !variant
    ? (books as BookInterface[]).map((book) => (
        <BookCard key={book.id} bookData={book} />
      ))
    : variant === "REVIEWS"
    ? (books as BookReviewCardInterface[]).map((book) => (
        <BookReviewCard key={book.book.id} bookData={book} />
      ))
    : (books as BookCardInterface[]).map(({ book }) => (
        <BookCard key={book.id} bookData={book} />
      ));
};
