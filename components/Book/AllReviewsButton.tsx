"use client";

import type { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface AllReviewsButtonProps {
  href: `/${string}`;
}

export const AllReviewsButton: FC<AllReviewsButtonProps> = ({ href }) => {
  const t = useTranslations("Reviews.MyReview");

  return (
    <div className="flex justify-center text-md">
      <Link
        href={href}
        className="rounded-sm border-2 border-secondary px-6 py-3 text-secondary dark:border-secondary-light dark:text-secondary-light"
      >
        {t("all reviews")}
      </Link>
    </div>
  );
};
