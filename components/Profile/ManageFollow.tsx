"use client";

import { type Dispatch, type FC, type SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import axios from "axios";
import clsx from "clsx";

import { IoMdEye, IoMdEyeOff } from "react-icons/io";

import { GlobalErrors } from "~/lib/validations/errorsEnums";
import { FollowProfileValidator } from "~/lib/validations/followProfile";

import { Button } from "../ui/Buttons";

interface ManageFollowProps {
  userId: string;
  isFollowedState: boolean;
  setIsFollowedState: Dispatch<SetStateAction<boolean>>;
  followedByQuantityState?: number;
  setFollowedByQuantityState?: Dispatch<SetStateAction<number>>;
  className?: string;
}

export const ManageFollow: FC<ManageFollowProps> = ({
  userId,
  isFollowedState,
  followedByQuantityState,
  setFollowedByQuantityState,
  setIsFollowedState,
  className,
}) => {
  const t = useTranslations("Profile.FollowProfile");
  const te = useTranslations("Errors");

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true);
    const wasFollowed = isFollowedState;
    const prevFollowedByQuantity = followedByQuantityState
      ? followedByQuantityState
      : 0;
    setFollowedByQuantityState &&
      setFollowedByQuantityState((prev) => (wasFollowed ? prev - 1 : prev + 1));
    setIsFollowedState(!isFollowedState);

    try {
      FollowProfileValidator.parse({ profileId: userId });
      const { data }: { data: string } = await axios.post(
        `/api/profile/follow/`,
        { profileId: userId }
      );

      if (data !== GlobalErrors.SUCCESS) {
        toast.error(te(data));
        setIsFollowedState(wasFollowed);
        setFollowedByQuantityState &&
          setFollowedByQuantityState(prevFollowedByQuantity);
        return;
      }

      // on success
      router.refresh();
    } catch (error) {
      toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
      setIsFollowedState(wasFollowed);
      setFollowedByQuantityState &&
        setFollowedByQuantityState(prevFollowedByQuantity);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      onClick={handleFollow}
      loading={isLoading}
      defaultColor={false}
      size="xs"
      className={clsx("bg-white-light dark:bg-black-dark", className)}
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
  );
};
