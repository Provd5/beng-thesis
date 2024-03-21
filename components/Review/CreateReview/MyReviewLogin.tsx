"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

export const MyReviewLogin: FC = () => {
  const t = useTranslations("Reviews.CreateReview");

  return (
    <div className="flex flex-col justify-center gap-3 p-6 text-center text-md text-gray">
      <h1>{t("log in to add your review")}</h1>
    </div>
  );
};
