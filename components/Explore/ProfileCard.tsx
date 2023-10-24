"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { MdNavigateNext } from "react-icons/md";

import { AvatarImage } from "../Profile/AvatarImage";
import { FollowProfileButton } from "../ui/FollowProfileButton";
import { getBookmarkIcon } from "../ui/getBookmarkIcon";

interface ProfileCardProps {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  bookshelfQuantity: number;
  reviewsQuantity: number;
  likedBooksQuantity: number;
  OwnedAsQuantity: number;
  followedByQuantity: number;
  description: string | null;
  isFollowed: boolean;
}

export const ProfileCard: FC<ProfileCardProps> = ({
  id,
  fullName,
  avatarUrl,
  bookshelfQuantity,
  reviewsQuantity,
  likedBooksQuantity,
  OwnedAsQuantity,
  followedByQuantity,
  description,
  isFollowed,
}) => {
  const t = useTranslations("Explore.ProfileCard");

  const [isFollowedState, setIsFollowedState] = useState(isFollowed);
  const [followedByQuantityState, setFollowedByQuantityState] =
    useState(followedByQuantity);

  return (
    <div className="flex h-full w-full max-w-[400px] flex-col gap-2 rounded-md bg-white px-6 py-3 drop-shadow dark:bg-black">
      <div className="flex flex-auto flex-col gap-1">
        <Link href={`/profile/${fullName}`} className="flex gap-1">
          <AvatarImage
            size="sm"
            className="drop-shadow-icon"
            avatarSrc={avatarUrl}
          />
          <div className="flex flex-col gap-0.5">
            <h1 className="line-clamp-2 break-all text-sm font-bold">
              {fullName}
            </h1>
            <div className="my-0.5 flex gap-1.5">
              <div className="flex items-center gap-0.5">
                {getBookmarkIcon("ALREADY_READ", "sm")}
                <p>{bookshelfQuantity}</p>
              </div>
              <div className="flex items-center gap-0.5">
                {getBookmarkIcon("REVIEWS", "sm")}
                <p>{reviewsQuantity}</p>
              </div>
              <div className="flex items-center gap-0.5">
                {getBookmarkIcon("LIKED", "sm")}
                <p>{likedBooksQuantity}</p>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-end">
            <MdNavigateNext className="h-8 w-8" />
          </div>
        </Link>
        <div className="flex flex-col gap-0.5 text-xs">
          <p>
            <span>{t("owned books:")} </span>
            {OwnedAsQuantity}
          </p>
          <p>
            <span>{t("followers:")} </span>
            {followedByQuantityState}
          </p>
          {description && (
            <div>
              <h2 className="text-black-light dark:text-white-dark">
                {t("profile description:")}
              </h2>
              <p className="line-clamp-3">{description}</p>
            </div>
          )}
        </div>
      </div>
      <FollowProfileButton
        id={id}
        isFollowedState={isFollowedState}
        setIsFollowedState={setIsFollowedState}
        followedByQuantityState={followedByQuantityState}
        setFollowedByQuantityState={setFollowedByQuantityState}
        className="w-2/3 max-w-[200px] self-end"
      />
    </div>
  );
};
