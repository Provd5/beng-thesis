"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { type CategoryTypes } from "~/types/CategoryTypes";

import { getBookmarkIcon } from "~/components/ui/getBookmarkIcon";
import { getOwnedAsIcon } from "~/components/ui/getOwnedAsIcon";

interface BookshelfPageTitleProps {
  categoryVariant: CategoryTypes;
  booksQuantity: number;
}

export const BookshelfPageTitle: FC<BookshelfPageTitleProps> = ({
  categoryVariant,
  booksQuantity,
}) => {
  const t = useTranslations("Book.BookshelfTypes");
  const tb = useTranslations("Bookshelves");

  return (
    <>
      <div className="flex items-center">
        <div className="flex w-12 justify-center">
          {categoryVariant === "OWNED"
            ? getOwnedAsIcon("BOOK", "lg")
            : getBookmarkIcon(categoryVariant, "lg")}
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">{t(categoryVariant)}</h1>
          <p className="text-sm">
            {tb.rich("books quantity", {
              numBooks: booksQuantity,
              span: (chunks) => (
                <span className="text-secondary dark:text-secondary-light">
                  {chunks}
                </span>
              ),
            })}
          </p>
        </div>
      </div>
    </>
  );
};
