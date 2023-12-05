import { type FC, Suspense } from "react";

import { type CategoryTypes } from "~/types/CategoryTypes";
import {
  bookshelvesOrderByArray,
  booksOrderByArray,
} from "~/types/feed/OrderVariants";
import {
  BOOKS_FEED_TAKE_LIMIT,
  PROFILE_PAGE_BOOKS_TAKE_LIMIT,
} from "~/types/feed/TakeLimits";

import { fetchBooks } from "~/lib/actions/feed/books";

import { BookCard } from "../Explore/BookCard";
import { BookReviewCard } from "../Explore/BookReviewCard";
import { BookCardsLoader } from "../ui/Loaders/Skeletons/BookCardLoader";
import { BookReviewCardsLoader } from "../ui/Loaders/Skeletons/BookReviewCardLoader";
import { NotFoundItems } from "../ui/NotFoundItems";
import { FeedSort } from "./FeedSort";
import { Pagination } from "./Pagination";

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
  booksCount: number;
}

export const BooksFeed: FC<BooksFeedProps> = async ({
  variant,
  fullname,
  searchParams,
  booksCount,
}) => {
  const books = await fetchBooks(variant, fullname, searchParams);

  const takeLimit = !variant
    ? BOOKS_FEED_TAKE_LIMIT
    : PROFILE_PAGE_BOOKS_TAKE_LIMIT;

  const maxTakeLimit = booksCount < takeLimit ? booksCount : takeLimit;

  return !(booksCount > 0) ? (
    <NotFoundItems />
  ) : (
    <>
      <FeedSort
        orderArray={!variant ? booksOrderByArray : bookshelvesOrderByArray}
        searchParams={searchParams}
      />

      <div
        className={
          variant === "REVIEWS"
            ? "grid grid-cols-1 gap-5"
            : "grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-2"
        }
      >
        <Suspense
          fallback={
            variant === "REVIEWS" ? (
              <BookReviewCardsLoader items={maxTakeLimit} />
            ) : (
              <BookCardsLoader items={maxTakeLimit} />
            )
          }
        >
          {!variant
            ? (books as BookInterface[]).map((book) => (
                <BookCard key={book.id} bookData={book} />
              ))
            : variant === "REVIEWS"
            ? (books as BookReviewCardInterface[]).map((book) => (
                <BookReviewCard key={book.book.id} bookData={book} />
              ))
            : (books as BookCardInterface[]).map(({ book }) => (
                <BookCard key={book.id} bookData={book} />
              ))}
        </Suspense>
      </div>
      <Pagination
        searchParams={searchParams}
        totalItems={booksCount}
        takeLimit={maxTakeLimit}
      />
    </>
  );
};
