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
    <div className="text-md flex justify-center">
      <Link
        replace
        href={href}
        className="rounded-lg border border-colors-primary px-6 py-3 text-colors-primary transition-colors hover:bg-colors-primary hover:text-white"
      >
        {t("all reviews")}
      </Link>
    </div>
  );
};
