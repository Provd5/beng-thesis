"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { dateFormater } from "~/utils/dateFormater";

import { AvatarImage } from "./AvatarImage";

interface EditProfileDataProps {
  avatarUrl: string | null;
  email: string | undefined;
  createdAt: Date;
  provider: string | undefined;
}

export const EditProfileData: FC<EditProfileDataProps> = ({
  avatarUrl,
  email,
  createdAt,
  provider,
}) => {
  const t = useTranslations("Profile.EditUsername");

  return (
    <div className="flex flex-col gap-1">
      <AvatarImage
        size="lg"
        avatarSrc={avatarUrl}
        className="mb-1 self-center"
      />
      <div className="flex flex-col gap-1">
        <p className="self-center">{email}</p>
        <p>
          <span className="font-semibold">{t("account created:")}</span>{" "}
          {dateFormater(createdAt, true)}
        </p>
        <p>
          <span className="font-semibold">{t("created by:")}</span>{" "}
          <span className="uppercase">{provider}</span>
        </p>
      </div>
    </div>
  );
};
