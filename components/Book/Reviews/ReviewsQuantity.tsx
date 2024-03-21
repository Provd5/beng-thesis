"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

interface ReviewsQuantityProps {
  reviewsQuantity: number;
}

export const ReviewsQuantity: FC<ReviewsQuantityProps> = ({
  reviewsQuantity,
}) => {
  const t = useTranslations("Book.BookCard");

  return (
    <div className="flex flex-col pt-1">
      <h3 className="text-secondary dark:text-secondary-light">
        {t("reviews")}
      </h3>
      <p>{reviewsQuantity}</p>
    </div>
  );
};
