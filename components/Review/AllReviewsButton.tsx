"use client";

import type { FC } from "react";
import { type Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface AllReviewsButtonProps {
  href: Url;
}

export const AllReviewsButton: FC<AllReviewsButtonProps> = ({ href }) => {
  const t = useTranslations("Reviews.CreateReview");

  return (
    <div className="flex justify-center text-md">
      <Link
        replace
        href={href}
        className="rounded-sm border border-secondary px-6 py-3 text-secondary dark:border-secondary-light dark:text-secondary-light"
      >
        {t("all reviews")}
      </Link>
    </div>
  );
};
