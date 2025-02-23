"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import {
  type GetReviewInterface,
  HIGHEST_REVIEW_RATE,
} from "~/types/data/review";

import { BookmarkIcon } from "~/components/ui/Icons/BookmarkIcon";
import { dateFormater } from "~/utils/dateFormater";

interface ReviewCardDetailsProps {
  reviewData: GetReviewInterface;
}

export const ReviewCardDetails: FC<ReviewCardDetailsProps> = ({
  reviewData,
}) => {
  const t = useTranslations("Reviews.Review");

  return (
    <>
      <h2 className="flex flex-col text-xs text-colors-text">
        {t("posted:")} {dateFormater(reviewData.created_at, true)}
        {reviewData.updated_at && (
          <span>
            {t("edited:")} {dateFormater(reviewData.updated_at, true)}
          </span>
        )}
      </h2>
      <div className="my-1 flex flex-wrap items-center gap-x-2 text-base">
        <h1 className="whitespace-nowrap font-semibold">
          {t("rate:")}{" "}
          <span className="font-bold text-colors-primary">
            {`${reviewData.rate}/${HIGHEST_REVIEW_RATE}`}
          </span>
        </h1>
        {reviewData.profile._count.liked_book > 0 && (
          <div className="flex items-center gap-0.5">
            <BookmarkIcon category="LIKED" size="sm" />
            <span className="text-xs">{t("likes it")}</span>
          </div>
        )}
      </div>
    </>
  );
};
