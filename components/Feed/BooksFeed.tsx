"use client";

import { type FC } from "react";

import {
  type BookCardInterface,
  type BookInterface,
  type BookReviewCardInterface,
} from "~/types/BookCardDataInterface";

import {
  type FetchBooksProps,
  useFetchBooks,
} from "~/hooks/feed/useFetchBooks";

import { BookCard, BookCardLoader } from "../Explore/BookCard";
import {
  BookReviewCard,
  BookReviewCardLoader,
} from "../Explore/BookReviewCard";
import { FetchMoreButton } from "./FetchMoreButton";

export const BooksFeed: FC<FetchBooksProps> = (props) => {
  const { booksData, fetchBooks, isLoading, pageNumber } = useFetchBooks(props);

  return (
    <>
      {props.variant === "REVIEWS" ? (
        <div className="grid grid-cols-1 gap-5">
          {isLoading &&
            pageNumber === 1 &&
            Array.from({ length: props.takeLimit }, (_, i) => (
              <BookReviewCardLoader key={i} />
            ))}
          {(booksData as BookReviewCardInterface[]).map((data) => (
            <BookReviewCard key={data.book.id} bookData={data} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {isLoading &&
            pageNumber === 1 &&
            Array.from({ length: props.takeLimit }, (_, i) => (
              <BookCardLoader key={i} />
            ))}
          {props.variant === undefined
            ? (booksData as BookInterface[]).map((data) => (
                <BookCard key={data.id} bookData={data} />
              ))
            : (booksData as BookCardInterface[]).map((data) => (
                <BookCard key={data.book.id} bookData={data.book} />
              ))}
        </div>
      )}
      <FetchMoreButton
        className="flex w-full items-center justify-center py-6"
        isLoading={isLoading}
        fetchMoreFunc={fetchBooks}
        takeLimit={props.takeLimit}
        pageNumber={pageNumber}
        dataLength={booksData.length}
      />
    </>
  );
};
