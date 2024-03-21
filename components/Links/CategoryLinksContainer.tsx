"use client";

import { type FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { CategoriesArray } from "~/types/categoryArrays";

import { convertTypeEnumToPathname } from "~/utils/pathnameTypeEnumConverter";
import ROUTES from "~/utils/routes";

export const CategoryLinksContainer: FC = () => {
  const t = useTranslations("Book.BookshelfTypes");

  const pathname = usePathname();
  const pathnameParts = pathname.split("/");

  return CategoriesArray.map((categoryVariant) => {
    const isActive = () => {
      if (pathnameParts[4] === convertTypeEnumToPathname(categoryVariant))
        return true;

      return false;
    };

    return (
      <Link
        key={categoryVariant}
        replace
        href={ROUTES.profile.bookshelf(categoryVariant)}
        className={clsx(
          "whitespace-nowrap rounded-xl border border-secondary px-5 py-2.5 text-sm dark:border-secondary-light",
          isActive()
            ? "bg-secondary text-white dark:bg-secondary-light"
            : "text-secondary dark:text-secondary-light"
        )}
      >
        {t(categoryVariant)}
      </Link>
    );
  });
};
