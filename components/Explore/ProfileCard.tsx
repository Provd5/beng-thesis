"use client";

import { type FC, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useTranslations } from "next-intl";
import axios from "axios";

import { IoMdEye, IoMdEyeOff } from "react-icons/io";

import { GlobalErrors } from "~/lib/validations/errorsEnums";
import { FollowProfileValidator } from "~/lib/validations/followProfile";

import { AvatarImage } from "../Profile/AvatarImage";
import { Button } from "../ui/Buttons";
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
  const te = useTranslations("Errors");

  const [isLoading, setIsLoading] = useState(false);
  const [isFollowedState, setIsFollowedState] = useState(isFollowed);
  const [followedByQuantityState, setFollowedByQuantityState] =
    useState(followedByQuantity);

  const handleFollow = async () => {
    setIsLoading(true);
    const wasFollowed = isFollowedState;
    const prevFollowedByQuantity = followedByQuantityState;
    setFollowedByQuantityState((prev) => (wasFollowed ? prev - 1 : prev + 1));
    setIsFollowedState(!isFollowedState);

    try {
      FollowProfileValidator.parse({ profileId: id });
      const { data }: { data: string } = await axios.post(
        `/api/profile/follow/`,
        { profileId: id }
      );

      if (data !== GlobalErrors.SUCCESS) {
        toast.error(te(data));
        setIsFollowedState(wasFollowed);
        setFollowedByQuantityState(prevFollowedByQuantity);
        return;
      }
    } catch (error) {
      toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
      setIsFollowedState(wasFollowed);
      setFollowedByQuantityState(prevFollowedByQuantity);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

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
      <Button
        onClick={handleFollow}
        loading={isLoading}
        defaultColor={false}
        size="xs"
        className="w-2/3 max-w-[200px] self-end bg-white-light dark:bg-black-dark"
      >
        {isFollowedState
          ? !isLoading && (
              <>
                <IoMdEyeOff className="text-red" /> {t("unfollow")}
              </>
            )
          : !isLoading && (
              <>
                <IoMdEye className="text-green" /> {t("follow")}
              </>
            )}
      </Button>
    </div>
  );
};
