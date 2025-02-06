"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { BsBookmarkStar } from "react-icons/bs";

import { BookmarkIcon } from "~/components/ui/Icons/BookmarkIcon";
import { dateFormater } from "~/utils/dateFormater";

interface HandleSelectReviewProps {
  reviewData: { rate: number; created_at: Date } | null | undefined;
  reviewsQuantity: number;
}

export const HandleSelectReview: FC<HandleSelectReviewProps> = ({
  reviewData,
  reviewsQuantity,
}) => {
  const t = useTranslations("Book.ManageReviews");

  const isSession = reviewData !== undefined;

  const handleFocusReview = () => {
    if (!isSession) return;

    const reviewTextarea = document.getElementById(
      "review-text",
    ) as HTMLTextAreaElement | null;

    reviewTextarea?.focus();
    reviewTextarea?.select();
    reviewTextarea?.scrollIntoView();
  };

  return (
    <button
      className="flex h-fit min-h-[60px] w-[132px] rounded-md bg-white/90 p-1 text-left transition-colors hover:bg-colors-gray/10 dark:bg-black/30 hover:dark:bg-white/10"
      disabled={!isSession}
      onClick={handleFocusReview}
    >
      <div className="flex">
        <div className="flex h-fit">
          {reviewData ? (
            <BookmarkIcon category="REVIEWS" size="lg" />
          ) : (
            <BookmarkIcon Icon={BsBookmarkStar} color="gradient" size="lg" />
          )}
        </div>
        <div className="flex flex-col">
          <h3 className="px-1 text-base font-semibold text-colors-primary">
            {t("reviews")}
          </h3>
          <p className="-mt-1 ml-1 whitespace-nowrap text-sm font-bold">
            {reviewsQuantity}
          </p>
          {reviewData?.created_at && (
            <p className="-mt-0.5 ml-1 whitespace-nowrap text-xs text-colors-text">
              {dateFormater(reviewData.created_at)}
            </p>
          )}
        </div>
      </div>
    </button>
  );
};
