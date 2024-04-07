"use client";

import { type FC, useState } from "react";
import toast from "react-hot-toast";
import {
  type Formats,
  type TranslationValues,
  useTranslations,
} from "next-intl";

import { IoMdEye, IoMdEyeOff } from "react-icons/io";

import { Button } from "~/components/ui/Buttons";
import { postFollow } from "~/lib/services/profile";
import { translatableError } from "~/utils/translatableError";

interface FollowFormProps {
  userId: string;
  isFollowed: boolean;
}

export const FollowForm: FC<FollowFormProps> = ({ userId, isFollowed }) => {
  const t = useTranslations("Profile.FollowProfile");
  const te = useTranslations("Errors") as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined
  ) => string;

  const [followState, setFollowState] = useState(isFollowed);

  const handleFollow = async () => {
    setFollowState(!followState);

    try {
      await postFollow(userId);
    } catch (e) {
      setFollowState(followState);
      toast.error(te(translatableError(e)));
    }
  };

  return (
    <Button
      onClick={() => handleFollow()}
      defaultColor={false}
      size="xs"
      className="w-48 bg-black/5 text-colors-text transition-colors hover:bg-black/20 dark:bg-white/20 hover:dark:bg-white/50"
    >
      {followState ? (
        <>
          <IoMdEyeOff className="size-4 text-colors-red" /> {t("unfollow")}
        </>
      ) : (
        <>
          <IoMdEye className="size-4 text-colors-green" /> {t("follow")}
        </>
      )}
    </Button>
  );
};
