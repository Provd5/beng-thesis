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
    <div className="flex gap-2">
      <h3 className="text-colors-primary">{t("reviews")}</h3>
      <p className="text-md">{reviewsQuantity}</p>
    </div>
  );
};
