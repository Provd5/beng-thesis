"use client";

import type { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { MdNavigateNext } from "react-icons/md";

import { type GetProfileInterface } from "~/types/data/profile";

import { BookmarkIcon } from "~/components/ui/Icons/BookmarkIcon";
import ROUTES from "~/utils/routes";

import { AvatarImage } from "../AvatarImage";

interface ProfileCardDetailsProps {
  profileData: GetProfileInterface;
}

export const ProfileCardDetails: FC<ProfileCardDetailsProps> = ({
  profileData,
}) => {
  const t = useTranslations("Explore.ProfileCard");

  if (!profileData.full_name) return;

  return (
    <div className="flex flex-auto flex-col gap-1">
      <Link
        href={ROUTES.profile.root(profileData.full_name)}
        className="flex gap-1 transition-transform hover:translate-x-1"
      >
        <AvatarImage
          size="sm"
          className="drop-shadow-icon"
          avatarSrc={profileData.avatar_url}
        />
        <div className="flex w-full flex-col gap-0.5">
          <h1 className="line-clamp-2 break-words text-sm font-bold">
            {profileData.full_name}
          </h1>
          <div className="my-0.5 flex gap-1.5">
            <div className="flex items-center gap-0.5">
              <BookmarkIcon category="ALREADY_READ" size="sm" />
              <p>{profileData._count.bookshelf}</p>
            </div>
            <div className="flex items-center gap-0.5">
              <BookmarkIcon category="REVIEWS" size="sm" />
              <p>{profileData._count.review}</p>
            </div>
            <div className="flex items-center gap-0.5">
              <BookmarkIcon category="LIKED" size="sm" />
              <p>{profileData._count.liked_book}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <MdNavigateNext className="size-8" />
        </div>
      </Link>
      <div className="flex flex-col gap-0.5 text-xs">
        <p>
          <span>{t("owned books:")} </span>
          {profileData._count.book_owned_as}
        </p>
        <p>
          <span>{t("followers:")} </span>
          {profileData._count.followed_by}
        </p>
        {profileData.description && (
          <div>
            <h2 className="text-colors-text">{t("profile description:")}</h2>
            <p className="line-clamp-3">{profileData.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};
