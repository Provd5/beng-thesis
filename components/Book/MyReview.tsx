"use client";

import { type FC, useState } from "react";
import { useTranslations } from "next-intl";

import { FaPenToSquare } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

import {
  type ReviewCardDataInterface,
  type ReviewReactionsInterface,
} from "~/types/feed/ReviewCardDataInterface";

import { CreateReview } from "./CreateReview";
import { ReviewCard } from "./ReviewCard";

interface MyReviewProps {
  reviewData: ReviewCardDataInterface | null | undefined;
  reviewReactions: ReviewReactionsInterface;
  bookId: string;
}

export const MyReview: FC<MyReviewProps> = ({
  reviewData,
  reviewReactions,
  bookId,
}) => {
  const t = useTranslations("Reviews.CreateReview");

  const [showCreateReview, setShowCreateReview] = useState(!reviewData);

  return reviewData === undefined ? (
    <div className="flex flex-col justify-center gap-3 p-6 text-center text-md text-gray">
      <h1>{t("log in to add your review")}</h1>
    </div>
  ) : (
    <>
      <div className="flex w-full justify-end">
        {!!reviewData ? (
          <button
            id="review-edit-button"
            className="flex items-center gap-1 px-3 py-1"
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
                  {t("edit")}
                </p>
                <FaPenToSquare className="text-md text-black-light dark:text-white-dark" />
              </>
            )}
          </button>
        ) : (
          <div className="my-0.5 h-6" />
        )}
      </div>
      {!!reviewData && !showCreateReview ? (
        <ReviewCard
          isMyReview
          reviewData={reviewData}
          reviewReactions={reviewReactions}
        />
      ) : (
        <CreateReview
          isReviewExists={!!reviewData}
          bookId={bookId}
          avatarUrl={reviewData?.profile.avatar_url}
          fullName={reviewData?.profile.full_name}
          rate={reviewData?.rate}
          text={reviewData?.text}
          closeReview={() => setShowCreateReview(false)}
        />
      )}
    </>
  );
};
