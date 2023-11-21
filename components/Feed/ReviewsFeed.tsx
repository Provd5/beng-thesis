"use client";

import { type FC } from "react";

import { type FetchReviewsProps } from "~/types/feed/FetchProps";
import { type ReviewCardDataInterface } from "~/types/feed/ReviewCardDataInterface";

import { useFetchData } from "~/hooks/useFetchData";
import { findMyReaction } from "~/utils/findMyReaction";

import { ReviewCard } from "../Book/ReviewCard";
import { ReviewCardLoader } from "../ui/Loaders/Skeletons/ReviewCardLoader";
import { NotFoundItems } from "../ui/NotFoundItems";
import { FetchMoreButton } from "./FetchMoreButton";

export const ReviewsFeed: FC<
  FetchReviewsProps & { sessionId: string | undefined }
> = (props) => {
  const { fetchedData, fetchMore, isLoading, pageNumber } = useFetchData({
    fetchType: "reviews",
    ...props,
  });
  const reviewsData = fetchedData as ReviewCardDataInterface[];

  return (
    <>
      <div className="grid grid-cols-1 gap-3">
        {isLoading &&
          pageNumber === 1 &&
          Array.from({ length: props.takeLimit }, (_, i) => (
            <div key={i} className="contents">
              <ReviewCardLoader index={i} />
              <hr className="h-px border-0 bg-gray" />
            </div>
          ))}
        {reviewsData.map((data) => {
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
      {!isLoading && !reviewsData.length && (
        <NotFoundItems itemType="reviews" />
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
