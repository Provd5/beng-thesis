"use client";

import { type FC, useState } from "react";
import { useTranslations } from "next-intl";

import { FaPenToSquare } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

import { useFetchReviews } from "~/hooks/feed/useFetchReviews";
import { findMyReaction } from "~/utils/findMyReaction";

import { ReviewCardLoader } from "../ui/Loaders/Skeletons/ReviewCardLoader";
import { CreateReview } from "./CreateReview";
import { ReviewCard } from "./ReviewCard";

interface MyReviewProps {
  bookId: string;
  sessionId: string | undefined;
}

export const MyReview: FC<MyReviewProps> = ({ bookId, sessionId }) => {
  const t = useTranslations("Reviews.MyReview");
  const { fetchedData, isLoading } = useFetchReviews({
    bookId,
    sessionId,
    userId: sessionId,
    takeLimit: 1,
  });

  const myReviewData = fetchedData ? fetchedData[0] : undefined;
  const myReaction = myReviewData
    ? findMyReaction(myReviewData.review_reaction, sessionId)
    : undefined;

  const [showCreateReview, setShowCreateReview] = useState(!!myReviewData);

  return (
    <>
      <div className="flex w-full justify-end px-3">
        {!!myReviewData && (
          <button
            id="review-edit-button"
            className="flex items-center gap-1 py-0.5"
            onClick={() => setShowCreateReview(!showCreateReview)}
          >
            {showCreateReview ? (
              <>
                <p className="select-none text-base text-black-light/50 dark:text-white-dark/50">
                  {t("cancel")}
                </p>
                <RxCross2 className="text-md text-black-light dark:text-white-dark" />
              </>
            ) : (
              <>
                <p className="select-none text-base text-black-light/50 dark:text-white-dark/50">
                  {t("your review")}
                </p>
                <FaPenToSquare className="text-md text-black-light dark:text-white-dark" />
              </>
            )}
          </button>
        )}
      </div>
      {isLoading ? (
        <ReviewCardLoader isMyReview />
      ) : myReviewData && !showCreateReview ? (
        <ReviewCard
          isMyReview
          reviewData={myReviewData}
          myReaction={myReaction}
        />
      ) : (
        <CreateReview
          isReviewExists={!!myReviewData}
          bookId={bookId}
          avatarUrl={myReviewData?.profile.avatar_url}
          fullName={myReviewData?.profile.full_name}
          score={myReviewData?.score}
          text={myReviewData?.text}
          closeReview={() => setShowCreateReview(false)}
        />
      )}
    </>
  );
};
