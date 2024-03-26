"use client";

import { type FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { CategoriesArray } from "~/types/consts";

import { convertTypeEnumToPathname } from "~/utils/pathnameTypeEnumConverter";
import ROUTES from "~/utils/routes";

interface CategoryLinksContainerProps {
  profileName: string;
}

export const CategoryLinksContainer: FC<CategoryLinksContainerProps> = ({
  profileName,
}) => {
  const t = useTranslations("Book.BookshelfTypes");

  const pathname = usePathname();
  const pathnameParts = pathname.split("/");

  return CategoriesArray.map((categoryVariant) => {
    const categoryVariantAsPathname =
      convertTypeEnumToPathname(categoryVariant);
    const isActive = () => {
      if (pathnameParts[4] === categoryVariantAsPathname) return true;

      return false;
    };

    return (
      <Link
        key={categoryVariant}
        replace
        href={ROUTES.profile.bookshelf(
          profileName,
          convertTypeEnumToPathname(categoryVariant)
        )}
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
