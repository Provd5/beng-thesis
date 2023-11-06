"use client";

import { type FC } from "react";

import {
  type FetchBooksProps,
  useFetchBooks,
} from "~/hooks/feed/useFetchBooks";

import { BookCard } from "../Explore/BookCard";
import { BookReviewCard } from "../Explore/BookReviewCard";
import { BookCardLoader } from "../ui/Loaders/Skeletons/BookCardLoader";
import { BookReviewCardLoader } from "../ui/Loaders/Skeletons/BookReviewCardLoader";
import { FetchMoreButton } from "./FetchMoreButton";

export const BooksFeed: FC<FetchBooksProps> = (props) => {
  const { fetchedData, fetchMore, isLoading, pageNumber } =
    useFetchBooks(props);

  return (
    <>
      {props.variant === "REVIEWS" ? (
        <div className="grid grid-cols-1 gap-5">
          {isLoading &&
            pageNumber === 1 &&
            Array.from({ length: props.takeLimit }, (_, i) => (
              <BookReviewCardLoader key={i} />
            ))}
          {(fetchedData as BookReviewCardInterface[]).map((data) => (
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
            ? (fetchedData as BookInterface[]).map((data) => (
                <BookCard key={data.id} bookData={data} />
              ))
            : (fetchedData as BookCardInterface[]).map((data) => (
                <BookCard key={data.book.id} bookData={data.book} />
              ))}
        </div>
      )}
      <FetchMoreButton
        className="flex w-full items-center justify-center py-6"
        isLoading={isLoading}
        fetchMoreFunc={fetchMore}
        takeLimit={props.takeLimit}
        pageNumber={pageNumber}
        dataLength={fetchedData.length}
      />
    </>
  );
};
