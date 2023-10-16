"use client";

import type { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { MdNavigateNext } from "react-icons/md";

import { type categoryTypes } from "~/types/categoryTypes";

import { getBookmarkIcon } from "./getBookmarkIcon";

interface CategoryLinkProps {
  variant: categoryTypes;
  href: `/${string}`;
  withoutIcon?: boolean;
  quantity?: number;
}

export const CategoryLink: FC<CategoryLinkProps> = ({
  variant,
  href,
  withoutIcon,
  quantity,
}) => {
  const t = useTranslations("Book.BookshelfTypes");

  return (
    <div className="flex w-full">
      <Link
        href={href}
        className="flex grow items-center justify-between gap-3 md:grow-0 md:justify-start"
      >
        <div className="text-lg font-semibold text-secondary dark:text-secondary-light">
          <div className="flex items-center gap-1">
            {!withoutIcon && getBookmarkIcon(variant)}
            <h1>
              {t(variant)}
              {quantity !== undefined && ` – ${quantity}`}
            </h1>
          </div>
        </div>
        <MdNavigateNext className="text-xl text-secondary dark:text-secondary-light" />
      </Link>
    </div>
  );
};
