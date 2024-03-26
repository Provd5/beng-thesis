"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { BsBookmarkStar } from "react-icons/bs";

import { type ReviewInterface } from "~/types/data/review";

import { BookmarkIcon } from "~/components/ui/Icons/BookmarkIcon";
import { dateFormater } from "~/utils/dateFormater";

interface HandleSelectReviewProps {
  reviewData: ReviewInterface | null | undefined;
  reviewsQuantity: number;
}

export const HandleSelectReview: FC<HandleSelectReviewProps> = ({
  reviewData,
  reviewsQuantity,
}) => {
  const t = useTranslations("Book.ManageReviews");

  const isSession = reviewData !== undefined;

  const handleFocusReview = () => {
    const reviewTextarea = document.getElementById(
      "review-text"
    ) as HTMLTextAreaElement | null;

    reviewTextarea?.focus();
    reviewTextarea?.select();
  };

  return (
    <button
      className="flex w-fit gap-1 text-left"
      disabled={!isSession}
      onClick={handleFocusReview}
    >
      <div className="flex h-fit">
        {!!reviewData ? (
          <BookmarkIcon category="REVIEWS" size="lg" />
        ) : (
          <BookmarkIcon Icon={BsBookmarkStar} color="gradient" size="lg" />
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex h-6 items-center">
          <h3 className="text-base font-semibold text-secondary dark:text-secondary-light">
            {t("reviews")}
          </h3>
        </div>
        <p>{reviewsQuantity}</p>
        {isSession && (
          <p className="text-xs text-black-light dark:text-white-dark">
            {reviewData?.created_at ? (
              dateFormater(reviewData.created_at)
            ) : (
              <span className="select-none underline">{t("write yours")}</span>
            )}
          </p>
        )}
      </div>
    </button>
  );
};
