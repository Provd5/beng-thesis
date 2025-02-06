"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { type GetReviewInterface } from "~/types/data/review";

import { AvatarImage } from "~/components/Profile/AvatarImage";
import { BookmarkIcon } from "~/components/ui/Icons/BookmarkIcon";
import { dateFormater } from "~/utils/dateFormater";

interface ReviewCardProfileDetailsProps {
  profileData: GetReviewInterface["profile"];
}

export const ReviewCardProfileDetails: FC<ReviewCardProfileDetailsProps> = ({
  profileData,
}) => {
  const t = useTranslations("Reviews.Review");

  return (
    <>
      <AvatarImage
        className="drop-shadow-icon"
        avatarSrc={profileData.avatar_url}
      />
      <div className="flex flex-col gap-0.5 sm:items-center">
        <h1 className="line-clamp-3 break-words font-bold">
          {profileData.full_name}
        </h1>
        <h2 className="flex flex-wrap text-xs text-colors-text sm:justify-center">
          {t("joined:")} <span>{dateFormater(profileData.created_at)}</span>
        </h2>
        <div className="my-1 flex gap-2 text-base">
          <div className="flex items-center gap-0.5">
            <BookmarkIcon category="ALREADY_READ" size="sm" />
            <p>{profileData._count.bookshelf}</p>
          </div>
          <div className="flex items-center gap-0.5">
            <BookmarkIcon category="REVIEWS" size="sm" />
            <p>{profileData._count.review}</p>
          </div>
        </div>
      </div>
    </>
  );
};
