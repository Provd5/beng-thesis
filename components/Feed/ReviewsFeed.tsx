"use client";

import { type FC } from "react";

import {
  type FetchReviewsProps,
  useFetchReviews,
} from "~/hooks/feed/useFetchReviews";
import { findMyReaction } from "~/utils/findMyReaction";

import { ReviewCard } from "../Book/ReviewCard";
import { ReviewCardLoader } from "../ui/Loaders/Skeletons/ReviewCardLoader";
import { FetchMoreButton } from "./FetchMoreButton";

export const ReviewsFeed: FC<FetchReviewsProps> = (props) => {
  const { fetchedData, fetchMore, isLoading, pageNumber } = useFetchReviews({
    bookId: props.bookId,
    takeLimit: props.takeLimit,
    order: props.order,
    orderBy: props.orderBy,
  });

  return (
    <>
      <div className="grid grid-cols-1 gap-3">
        {isLoading &&
          pageNumber === 1 &&
          Array.from({ length: props.takeLimit }, (_, i) => (
            <div key={i} className="contents">
              <ReviewCardLoader />
              <hr className="h-px border-0 bg-gray" />
            </div>
          ))}
        {fetchedData.map((data) => {
          const isMyReview = data.profile.id === props.sessionId;

          return (
            <div key={data.id} className="contents">
              <ReviewCard
                isMyReview={isMyReview}
                reviewData={data}
                myReaction={findMyReaction(
                  data.review_reaction,
                  props.sessionId
                )}
              />
              <hr className="h-px border-0 bg-gray" />
            </div>
          );
        })}
      </div>
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
