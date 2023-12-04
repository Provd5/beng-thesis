"use client";

import { type FC, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { categoryArray } from "~/types/CategoryTypes";

import { convertTypeEnumToPathname } from "~/utils/pathnameTypeEnumConverter";

export const CategoryLinksContainer: FC = () => {
  const t = useTranslations("Book.BookshelfTypes");

  const currentCategoryRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");

  useEffect(() => {
    if (currentCategoryRef.current) {
      currentCategoryRef.current.scrollIntoView({
        inline: "center",
        behavior: "instant",
      });
    }
  }, [pathname]);

  return categoryArray.map((categoryVariant) => {
    const categoryVariantPathname = convertTypeEnumToPathname(categoryVariant);

    const isActive = () => {
      if (pathnameParts[4] === categoryVariantPathname) return true;

      return false;
    };

    return (
      <Link
        scroll={false}
        ref={isActive() ? currentCategoryRef : null}
        key={categoryVariant}
        replace
        href={categoryVariantPathname}
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
