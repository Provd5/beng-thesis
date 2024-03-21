"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { HIGHEST_REVIEW_RATE } from "~/types/data/review";

import { dateFormater } from "~/utils/dateFormater";

interface BookReviewCardDetailsProps {
  rate: number;
  created_at: Date;
  updated_at: Date | null;
}

export const BookReviewCardDetails: FC<BookReviewCardDetailsProps> = ({
  rate,
  created_at,
  updated_at,
}) => {
  const t = useTranslations("Reviews.BookReviewCard");

  return (
    <div className="mt-1 flex flex-col gap-1">
      <h1>
        {t("your rate:")}{" "}
        <span className="text-secondary dark:text-secondary-light">{`${rate}/${HIGHEST_REVIEW_RATE}`}</span>
      </h1>
      <h2 className="flex text-xs text-black-light dark:text-white-dark">
        {t("posted:")} {dateFormater(created_at, true)}
        {updated_at && ` / ${t("edited:")} ${dateFormater(updated_at, true)}`}
      </h2>
    </div>
  );
};
