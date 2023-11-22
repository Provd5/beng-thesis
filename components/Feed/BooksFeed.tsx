"use client";

import { type FC } from "react";

import { type FetchBooksProps } from "~/types/feed/FetchProps";

import { useFetchData } from "~/hooks/useFetchData";

import { BookCard } from "../Explore/BookCard";
import { BookReviewCard } from "../Explore/BookReviewCard";
import { BookCardLoader } from "../ui/Loaders/Skeletons/BookCardLoader";
import { BookReviewCardLoader } from "../ui/Loaders/Skeletons/BookReviewCardLoader";
import { NotFoundItems } from "../ui/NotFoundItems";
import { FetchMoreButton } from "./FetchMoreButton";

export const BooksFeed: FC<
  FetchBooksProps & { sessionId: string | undefined }
> = (props) => {
  const { fetchedData, fetchMore, isLoading, pageNumber } = useFetchData({
    fetchType: "books",
    ...props,
  });

  return (
    <>
      {props.variant === "REVIEWS" ? (
        <div className="grid grid-cols-1 gap-5">
          {isLoading &&
            pageNumber === 1 &&
            Array.from({ length: props.takeLimit }, (_, i) => (
              <BookReviewCardLoader key={i} index={i} />
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
              <BookCardLoader key={i} index={i} />
            ))}
          {props.variant === undefined
            ? (fetchedData as BookInterface[]).map((data) => (
                <BookCard
                  key={data.id}
                  bookData={data}
                  sessionId={props.sessionId}
                />
              ))
            : (fetchedData as BookCardInterface[]).map((data) => (
                <BookCard
                  key={data.book.id}
                  bookData={data.book}
                  sessionId={props.sessionId}
                />
              ))}
        </div>
      )}
      {!isLoading && !fetchedData.length && <NotFoundItems />}
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
