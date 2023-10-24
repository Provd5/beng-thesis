"use client";

import type { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { AddBookPlaceholder } from "../ui/SvgIcons/AddBookPlaceholder";
import { ShowMorePlaceholder } from "../ui/SvgIcons/ShowMorePlaceholder";

interface CategoryContentCardPlaceholderProps {
  href: string;
  isEmpty?: boolean;
}

export const CategoryContentCardPlaceholder: FC<
  CategoryContentCardPlaceholderProps
> = ({ href, isEmpty }) => {
  const t = useTranslations("Profile.CategoryContentCard");

  return (
    <Link
      href={href}
      className="flex w-32 flex-none snap-center flex-col items-center gap-1 py-0.5 md:snap-start"
    >
      <div className="relative flex h-[140px] w-[97px] flex-none items-center justify-center overflow-hidden rounded-sm drop-shadow-book">
        {isEmpty ? (
          <AddBookPlaceholder />
        ) : (
          <div className="h-20 w-20 overflow-hidden rounded-full">
            <ShowMorePlaceholder />
          </div>
        )}
      </div>
      <div>
        <h1 className="text-center text-sm text-black-light dark:text-white-dark">
          {isEmpty ? t("this shelf is currently empty") : t("show more")}
        </h1>
      </div>
    </Link>
  );
};
