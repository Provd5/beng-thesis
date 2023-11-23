"use client";

import type { FC } from "react";
import { type Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { MdNavigateNext } from "react-icons/md";

import { type CategoryTypes } from "~/types/CategoryTypes";

import { getBookmarkIcon } from "./getBookmarkIcon";
import { getOwnedAsIcon } from "./getOwnedAsIcon";

interface CategoryLinkProps {
  variant: CategoryTypes;
  href: Url;
  hrefReplace?: boolean;
  withoutIcon?: boolean;
  quantity?: number;
}

export const CategoryLink: FC<CategoryLinkProps> = ({
  variant,
  href,
  hrefReplace = false,
  withoutIcon,
  quantity,
}) => {
  const t = useTranslations("Book.BookshelfTypes");

  return (
    <div className="flex w-full">
      <Link
        replace={hrefReplace}
        href={href}
        className="flex grow items-center justify-between gap-3 md:grow-0 md:justify-start"
      >
        <div className="text-lg font-semibold text-secondary dark:text-secondary-light">
          <div className="flex items-center gap-1">
            {!withoutIcon && variant === "OWNED"
              ? getOwnedAsIcon("BOOK", "sm")
              : getBookmarkIcon(variant)}
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
