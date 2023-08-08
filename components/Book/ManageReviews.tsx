"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { BsBookmarkStar } from "react-icons/bs";

import { dateFormater } from "~/utils/dateFormater";

import { BookmarksWrapper } from "../ui/BookmarksWrapper";
import { getBookmarkIcon } from "../ui/getBookmarkIcon";

interface ManageReviewsProps {
  isReviewExists: boolean;
  quantity: number;
  createdAt?: Date;
}

export const ManageReviews: FC<ManageReviewsProps> = ({
  isReviewExists,
  quantity,
  createdAt,
}) => {
  const t = useTranslations("Book.ManageReviews");

  const handleFocusReview = () => {
    const reviewEditButton = document.getElementById(
      "review-edit-button"
    ) as HTMLButtonElement | null;
    const reviewTextarea = document.getElementById(
      "review-textarea"
    ) as HTMLTextAreaElement | null;

    !reviewTextarea && reviewEditButton?.click();
    reviewTextarea?.focus();
    reviewTextarea?.select();
  };

  return (
    <div className="flex gap-1">
      <button onClick={handleFocusReview}>
        {isReviewExists ? (
          getBookmarkIcon("REVIEWS", "lg")
        ) : (
          <BookmarksWrapper Icon={BsBookmarkStar} color="gradient" size="lg" />
        )}
      </button>
      <div className="flex flex-col">
        <div className="flex h-[24px] items-center">
          <h3 className="text-base font-semibold text-secondary dark:text-secondary-light">
            {t("reviews")}
          </h3>
        </div>
        <p>{quantity}</p>
        <p className="text-xs text-black-light dark:text-white-dark">
          {createdAt ? (
            dateFormater(createdAt)
          ) : (
            <span
              onClick={handleFocusReview}
              className="cursor-pointer select-none underline"
            >
              {t("write yours")}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
