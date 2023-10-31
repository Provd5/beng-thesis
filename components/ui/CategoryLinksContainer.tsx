"use client";

import type { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { categoryArray } from "~/types/categoryTypes";

import { convertTypeEnumToPathname } from "~/utils/pathnameTypeEnumConverter";

export const CategoryLinksContainer: FC = () => {
  const t = useTranslations("Book.BookshelfTypes");

  const pathname = usePathname();
  const pathnameParts = pathname.split("/");

  return categoryArray.map((categoryVariant) => {
    const categoryVariantPathname = convertTypeEnumToPathname(categoryVariant);

    const isActive = () => {
      if (pathnameParts[4] === categoryVariantPathname) return true;

      return false;
    };

    return (
      <Link
        key={categoryVariant}
        replace
        href={`${categoryVariantPathname}`}
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
