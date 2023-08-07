"use client";

import type { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { AddBookPlaceholder } from "../ui/SvgIcons/AddBookPlaceholder";

export const CategoryContentCardPlaceholder: FC = () => {
  const t = useTranslations("Profile.CategoryContentCard");

  return (
    <Link
      href="/explore"
      className="flex w-32 flex-none flex-col items-center gap-1"
    >
      <div className="relative h-[140px] w-[97px] flex-none overflow-hidden rounded-sm drop-shadow-book">
        <AddBookPlaceholder />
      </div>
      <div>
        <h1 className="text-center text-sm text-black-light dark:text-white-dark">
          {t("this shelf is currently empty")}
        </h1>
      </div>
    </Link>
  );
};
