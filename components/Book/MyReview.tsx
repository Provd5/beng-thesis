"use client";

import { type FC, useState } from "react";
import { useTranslations } from "next-intl";

import { FaPenToSquare } from "react-icons/fa6";

import { CreateReview } from "./CreateReview";

interface MyReviewProps {
  children: React.ReactNode;
  bookId: string;
  myProfileData:
    | {
        avatar_url: string | null;
        full_name: string | null;
      }
    | null
    | undefined;
  isReviewExists: boolean;
  score?: number;
  text?: string;
}

export const MyReview: FC<MyReviewProps> = ({
  children,
  bookId,
  myProfileData,
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
      <div className="flex w-full justify-end px-3 py-0.5">
        {isReviewExists && (
          <button
            className="flex items-center gap-1"
            onClick={() => setShowEditReview(!showEditReview)}
          >
            <p className="text-base text-black-light/50 dark:text-white-dark/50">
              {t("your review")}
            </p>
            <FaPenToSquare className="text-md text-black-light dark:text-white-dark" />
          </button>
        )}
      </div>
      {!showEditReview
        ? children
        : myProfileData && (
            <CreateReview
              isReviewExists={isReviewExists}
              bookId={bookId}
              profileData={myProfileData}
              score={score}
              text={text}
              pullReviewState={pullReviewState}
            />
          )}
    </>
  );
};
