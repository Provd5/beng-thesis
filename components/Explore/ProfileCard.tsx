"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { MdNavigateNext } from "react-icons/md";

import { isFollowed } from "~/utils/isFollowed";

import { AvatarImage } from "../Profile/AvatarImage";
import { ManageFollow } from "../Profile/ManageFollow";
import { getBookmarkIcon } from "../ui/getBookmarkIcon";

interface ProfileCardProps {
  profileData: ProfileCardDataInterface;
  sessionId: string | undefined;
}

export const ProfileCard: FC<ProfileCardProps> = ({
  profileData,
  sessionId,
}) => {
  const t = useTranslations("Explore.ProfileCard");

  const [isFollowedState, setIsFollowedState] = useState(
    isFollowed(profileData.followed_by, sessionId)
  );
  const [followedByQuantityState, setFollowedByQuantityState] = useState(
    profileData._count.followed_by
  );

  return (
    <div className="flex h-full w-full max-w-[400px] flex-col gap-2 rounded-md bg-white px-6 py-3 drop-shadow dark:bg-black">
      <div className="flex flex-auto flex-col gap-1">
        <Link
          href={`/profile/${profileData.full_name}/`}
          className="flex gap-1"
        >
          <AvatarImage
            size="sm"
            className="drop-shadow-icon"
            avatarSrc={profileData.avatar_url}
          />
          <div className="flex w-full flex-col gap-0.5">
            <h1 className="line-clamp-2 break-all text-sm font-bold">
              {profileData.full_name}
            </h1>
            <div className="my-0.5 flex gap-1.5">
              <div className="flex items-center gap-0.5">
                {getBookmarkIcon("ALREADY_READ", "sm")}
                <p>{profileData._count.bookshelf}</p>
              </div>
              <div className="flex items-center gap-0.5">
                {getBookmarkIcon("REVIEWS", "sm")}
                <p>{profileData._count.review}</p>
              </div>
              <div className="flex items-center gap-0.5">
                {getBookmarkIcon("LIKED", "sm")}
                <p>{profileData._count.liked_book}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <MdNavigateNext className="h-8 w-8" />
          </div>
        </Link>
        <div className="flex flex-col gap-0.5 text-xs">
          <p>
            <span>{t("owned books:")} </span>
            {profileData._count.book_owned_as}
          </p>
          <p>
            <span>{t("followers:")} </span>
            {followedByQuantityState}
          </p>
          {profileData.description && (
            <div>
              <h2 className="text-black-light dark:text-white-dark">
                {t("profile description:")}
              </h2>
              <p className="line-clamp-3">{profileData.description}</p>
            </div>
          )}
        </div>
      </div>
      <ManageFollow
        userId={profileData.id}
        isFollowedState={isFollowedState}
        setIsFollowedState={setIsFollowedState}
        followedByQuantityState={followedByQuantityState}
        setFollowedByQuantityState={setFollowedByQuantityState}
        className="w-2/3 max-w-[200px] self-end"
      />
    </div>
  );
};
