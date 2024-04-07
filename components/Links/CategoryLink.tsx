"use client";

import type { FC } from "react";
import { type Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { MdNavigateNext } from "react-icons/md";

import { type BookshelvesTypes } from "~/types/consts";

import { BookmarkIcon } from "../ui/Icons/BookmarkIcon";
import { OwnedBookIcon } from "../ui/Icons/OwnedBookIcon";

interface CategoryLinkProps {
  bookshelfVariant: BookshelvesTypes;
  href: Url;
  replace?: boolean;
  allItems?: number;
}

export const CategoryLink: FC<CategoryLinkProps> = ({
  bookshelfVariant,
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
        className="flex grow items-center justify-between gap-3 transition-transform hover:translate-x-1 md:grow-0 md:justify-start"
      >
        <div className="text-lg font-semibold text-colors-primary">
          <div className="flex items-center gap-1">
            {bookshelfVariant === "OWNED" ? (
              <OwnedBookIcon ownedAs="BOOK" size="sm" />
            ) : (
              <BookmarkIcon category={bookshelfVariant} />
            )}
            <h1>
              {t(bookshelfVariant)}
              {allItems !== undefined && ` – ${allItems}`}
            </h1>
          </div>
        </div>
        <MdNavigateNext className="text-xl text-colors-primary" />
      </Link>
    </div>
  );
};
