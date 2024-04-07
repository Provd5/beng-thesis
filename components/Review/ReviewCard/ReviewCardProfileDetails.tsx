"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { AvatarImage } from "~/components/Profile/AvatarImage";
import { BookmarkIcon } from "~/components/ui/Icons/BookmarkIcon";
import { dateFormater } from "~/utils/dateFormater";

interface ReviewCardProfileDetailsProps {
  avatarUrl: string | null;
  profileName: string | null;
  createdAt: Date;
  bookshelfQuantity: number;
  reviewQuantity: number;
}

export const ReviewCardProfileDetails: FC<ReviewCardProfileDetailsProps> = ({
  avatarUrl,
  profileName,
  createdAt,
  bookshelfQuantity,
  reviewQuantity,
}) => {
  const t = useTranslations("Reviews.Review");

  return (
    <>
      <AvatarImage className="drop-shadow-icon" avatarSrc={avatarUrl} />
      <div className="flex flex-col gap-0.5 sm:items-center">
        <h1 className="line-clamp-3 break-words font-bold">{profileName}</h1>
        <h2 className="flex flex-wrap text-xs text-colors-text sm:justify-center">
          {t("joined:")} <span>{dateFormater(createdAt)}</span>
        </h2>
        <div className="my-1 flex gap-2 text-base">
          <div className="flex items-center gap-0.5">
            <BookmarkIcon category="ALREADY_READ" size="sm" />
            <p>{bookshelfQuantity}</p>
          </div>
          <div className="flex items-center gap-0.5">
            <BookmarkIcon category="REVIEWS" size="sm" />
            <p>{reviewQuantity}</p>
          </div>
        </div>
      </div>
    </>
  );
};
