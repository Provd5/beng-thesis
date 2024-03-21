"use client";

import type { FC } from "react";
import { type Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { MdNavigateNext } from "react-icons/md";

import { type CategoriesTypes } from "~/types/data/bookshelf";

import { BookmarkIcon } from "../ui/Icons/BookmarkIcon";
import { OwnedBookIcon } from "../ui/Icons/OwnedBookIcon";

interface CategoryLinkProps {
  categoryVariant: CategoriesTypes;
  href: Url;
  replace?: boolean;
  allItems?: number;
}

export const CategoryLink: FC<CategoryLinkProps> = ({
  categoryVariant,
  href,
  replace = false,
  allItems,
}) => {
  const t = useTranslations("Book.BookshelfTypes");

  return (
    <div className="flex w-full">
      <Link
        replace={replace}
        href={href}
        className="flex grow items-center justify-between gap-3 md:grow-0 md:justify-start"
      >
        <div className="text-lg font-semibold text-secondary dark:text-secondary-light">
          <div className="flex items-center gap-1">
            {categoryVariant !== "STATISTICS" &&
              (categoryVariant === "OWNED" ? (
                <OwnedBookIcon ownedAs="BOOK" size="sm" />
              ) : (
                <BookmarkIcon category={categoryVariant} />
              ))}
            <h1>
              {t(categoryVariant)}
              {allItems !== undefined && ` – ${allItems}`}
            </h1>
          </div>
        </div>
        <MdNavigateNext className="text-xl text-secondary dark:text-secondary-light" />
      </Link>
    </div>
  );
};
