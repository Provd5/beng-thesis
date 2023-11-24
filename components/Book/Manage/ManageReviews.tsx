"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { BsBookmarkStar } from "react-icons/bs";

import { dateFormater } from "~/utils/dateFormater";

import { BookmarksWrapper } from "../../ui/BookmarksWrapper";
import { getBookmarkIcon } from "../../ui/getBookmarkIcon";

interface ManageReviewsProps {
  isReviewExists: boolean;
  reviewsQuantity: number;
  createdAt: Date | undefined;
  sessionId: string | undefined;
}

export const ManageReviews: FC<ManageReviewsProps> = ({
  isReviewExists,
  reviewsQuantity,
  createdAt,
  sessionId,
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
    <button
      className="flex w-fit gap-1 text-left"
      disabled={!sessionId}
      onClick={handleFocusReview}
    >
      <div className="flex h-fit">
        {isReviewExists ? (
          getBookmarkIcon("REVIEWS", "lg")
        ) : (
          <BookmarksWrapper Icon={BsBookmarkStar} color="gradient" size="lg" />
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex h-6 items-center">
          <h3 className="text-base font-semibold text-secondary dark:text-secondary-light">
            {t("reviews")}
          </h3>
        </div>
        <p>{reviewsQuantity}</p>
        {!!sessionId && (
          <p className="text-xs text-black-light dark:text-white-dark">
            {createdAt ? (
              dateFormater(createdAt)
            ) : (
              <span className="select-none underline">{t("write yours")}</span>
            )}
          </p>
        )}
      </div>
    </button>
  );
};
