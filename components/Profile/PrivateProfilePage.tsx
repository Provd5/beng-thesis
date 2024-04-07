"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

export const PrivateProfilePage: FC = ({}) => {
  const t = useTranslations("Profile.Page");

  return (
    <div className="mt-3 flex flex-col gap-3">
      <h1 className="p-6 text-center text-lg">
        {t("this profile is private")} 😥
      </h1>
    </div>
  );
};
