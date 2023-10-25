"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

interface BookCardDetailsProps {
  scoresQuantity: number;
  reviewsQuantity: number;
}

export const BookCardDetails: FC<BookCardDetailsProps> = ({
  scoresQuantity,
  reviewsQuantity,
}) => {
  const t = useTranslations("Book.BookCard");

  return (
    <div className="flex gap-3">
      <div className="flex flex-col pt-0.5">
        <h3 className="text-base text-secondary dark:text-secondary-light">
          {t("score")}
        </h3>
        <p className="text-md">{`${scoresQuantity}/5`}</p>
      </div>
      <div className="flex flex-col pt-1">
        <h3 className="text-secondary dark:text-secondary-light">
          {t("reviews")}
        </h3>
        <p>{reviewsQuantity}</p>
      </div>
    </div>
  );
};
