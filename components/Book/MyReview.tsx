"use client";

import { type FC, useState } from "react";
import { useTranslations } from "next-intl";

import { FaPenToSquare } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

import { CreateReview } from "./CreateReview";

interface MyReviewProps {
  children: React.ReactNode;
  bookId: string;
  avatarUrl: string | null | undefined;
  fullName: string | null | undefined;
  isReviewExists: boolean;
  score?: number;
  text?: string;
}

export const MyReview: FC<MyReviewProps> = ({
  children,
  bookId,
  avatarUrl,
  fullName,
  isReviewExists,
  score,
  text,
}) => {
  const t = useTranslations("Book.MyReview");

  const [showEditReview, setShowEditReview] = useState(!isReviewExists);

  const pullReviewState = (data: boolean) => {
    setShowEditReview(data);
  };

  return (
    <>
      <div className="flex w-full justify-end px-3">
        {isReviewExists && (
          <button
            className="flex items-center gap-1 py-0.5"
            onClick={() => setShowEditReview(!showEditReview)}
          >
            {showEditReview ? (
              <>
                <p className="text-base text-black-light/50 dark:text-white-dark/50">
                  {t("cancel")}
                </p>
                <RxCross2 className="text-md text-black-light dark:text-white-dark" />
              </>
            ) : (
              <>
                <p className="text-base text-black-light/50 dark:text-white-dark/50">
                  {t("your review")}
                </p>
                <FaPenToSquare className="text-md text-black-light dark:text-white-dark" />
              </>
            )}
          </button>
        )}
      </div>
      {!showEditReview ? (
        children
      ) : (
        <CreateReview
          isReviewExists={isReviewExists}
          bookId={bookId}
          avatarUrl={avatarUrl}
          fullName={fullName}
          score={score}
          text={text}
          pullReviewState={pullReviewState}
        />
      )}
    </>
  );
};
