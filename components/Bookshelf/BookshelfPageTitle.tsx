"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { type BookshelvesTypes } from "~/types/consts";

import { BookmarkIcon } from "../ui/Icons/BookmarkIcon";
import { OwnedBookIcon } from "../ui/Icons/OwnedBookIcon";

interface BookshelfPageTitleProps {
  bookshelfVariant: BookshelvesTypes;
  booksQuantity: number;
}

export const BookshelfPageTitle: FC<BookshelfPageTitleProps> = ({
  bookshelfVariant,
  booksQuantity,
}) => {
  const t = useTranslations("Book.BookshelfTypes");
  const tb = useTranslations("Bookshelves");

  return (
    <>
      <div className="flex items-center">
        <div className="flex w-12 justify-center">
          {bookshelfVariant === "OWNED" ? (
            <OwnedBookIcon ownedAs="BOOK" size="lg" />
          ) : (
            <BookmarkIcon category={bookshelfVariant} size="lg" />
          )}
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">{t(bookshelfVariant)}</h1>
          <p className="text-sm">
            {tb.rich("books quantity", {
              numBooks: booksQuantity,
              span: (chunks) => (
                <span className="text-colors-primary">{chunks}</span>
              ),
            })}
          </p>
        </div>
      </div>
    </>
  );
};
