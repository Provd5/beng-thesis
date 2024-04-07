"use client";

import { type FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { BookshelvesArray, type BookshelvesTypes } from "~/types/consts";

import { cn } from "~/utils/cn";
import { convertTypeEnumToPathname } from "~/utils/pathnameTypeEnumConverter";
import ROUTES from "~/utils/routes";

import { BookmarkIcon } from "../ui/Icons/BookmarkIcon";
import { OwnedBookIcon } from "../ui/Icons/OwnedBookIcon";

interface CategoryLinksContainerProps {
  profileName: string;
  currentBookshelf: BookshelvesTypes;
}

export const CategoryLinksContainer: FC<CategoryLinksContainerProps> = ({
  profileName,
  currentBookshelf,
}) => {
  const t = useTranslations("Book.BookshelfTypes");

  return BookshelvesArray.map((bookshelfVariant) => {
    const bookshelfVariantAsPathname =
      convertTypeEnumToPathname(bookshelfVariant);

    const isActive = () => {
      if (currentBookshelf === bookshelfVariant) return true;

      return false;
    };

    return (
      <Link
        key={bookshelfVariant}
        replace
        href={{
          pathname: ROUTES.profile.root(profileName),
          query: { bookshelf: bookshelfVariantAsPathname },
        }}
        className={cn(
          "flex items-center gap-2 whitespace-nowrap rounded-xl border border-colors-primary px-5 py-2 text-sm transition-colors",
          isActive()
            ? "cursor-default bg-colors-primary text-white"
            : "text-colors-primary hover:bg-colors-primary/70 hover:text-white"
        )}
      >
        {bookshelfVariant === "OWNED" ? (
          <OwnedBookIcon ownedAs="BOOK" size="sm" />
        ) : (
          <BookmarkIcon category={bookshelfVariant} />
        )}
        {t(bookshelfVariant)}
      </Link>
    );
  });
};
