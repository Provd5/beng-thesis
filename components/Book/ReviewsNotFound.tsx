"use client";

import type { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface ReviewsNotFoundProps {
  backToHref: `/${string}`;
}

export const ReviewsNotFound: FC<ReviewsNotFoundProps> = ({ backToHref }) => {
  const t = useTranslations("Reviews.ReviewsNotFound");

  return (
    <>
      <div className="flex w-full flex-col items-center gap-1 py-6">
        <h1 className="px-6 text-center text-lg">
          {t("this book has no written reviews yet")} 😥
        </h1>
        <Link className="underline" href={backToHref}>
          {t("back")}
        </Link>
      </div>
    </>
  );
};
