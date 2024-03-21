import type { FC } from "react";
import { useTranslations } from "next-intl";

import { HIGHEST_REVIEW_RATE } from "~/types/data/review";

import { BookmarkIcon } from "~/components/ui/Icons/BookmarkIcon";
import { dateFormater } from "~/utils/dateFormater";

interface ReviewCardDetailsProps {
  createdAt: Date;
  updatedAt: Date | null;
  rate: number;
  likedBooksQuantity: number;
}

export const ReviewCardDetails: FC<ReviewCardDetailsProps> = ({
  createdAt,
  updatedAt,
  rate,
  likedBooksQuantity,
}) => {
  const t = useTranslations("Reviews.Review");

  return (
    <>
      {" "}
      <h2 className="flex flex-col text-xs text-black-light dark:text-white-dark">
        {t("posted:")} {dateFormater(createdAt, true)}
        {updatedAt && (
          <span>
            {t("edited:")} {dateFormater(updatedAt, true)}
          </span>
        )}
      </h2>
      <div className="my-1 flex flex-wrap items-center gap-x-2 text-base">
        <h1 className="whitespace-nowrap font-semibold">
          {t("rate:")}{" "}
          <span className="font-bold text-secondary dark:text-secondary-light">
            {`${rate}/${HIGHEST_REVIEW_RATE}`}
          </span>
        </h1>
        {likedBooksQuantity > 0 && (
          <div className="flex items-center gap-0.5">
            <BookmarkIcon category="LIKED" size="sm" />
            <span className="text-xs">{t("likes it")}</span>
          </div>
        )}
      </div>
    </>
  );
};
