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
    reviewTextarea?.scrollIntoView();
  };

  return (
    <button
      className="flex h-fit min-h-[70px] w-36 gap-1 rounded-md bg-white/90 p-1 transition-colors hover:bg-colors-gray/10 dark:bg-black/30 hover:dark:bg-white/10"
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
        <h3 className="px-1 py-0.5 text-base font-semibold text-colors-primary hover:animate-pulse">
          {t("reviews")}
        </h3>
        <p className="-mt-1">{reviewsQuantity}</p>
        {isSession && (
          <p className="text-xs text-colors-text">
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
