"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";
import { type bookshelfType } from "@prisma/client";
import clsx from "clsx";

import { BookshelfArray } from "~/types/consts";

import { BookmarkIcon } from "~/components/ui/Icons/BookmarkIcon";

interface BookshelfModalProps {
  changedBookshelf: (data: bookshelfType | null) => void;
  initialBookshelf: bookshelfType | null;
}

export const BookshelfModal: FC<BookshelfModalProps> = ({
  changedBookshelf,
  initialBookshelf,
}) => {
  const t = useTranslations("Book.ManageBookshelf");
  const tb = useTranslations("Book.BookshelfTypes");

  return (
    <div className="flex grow flex-col gap-2">
      {BookshelfArray.map((bookshelf) => (
        <button
          key={bookshelf}
          className="flex items-center gap-1 py-1.5"
          onClick={() => {
            changedBookshelf(bookshelf);
          }}
        >
          <BookmarkIcon category={bookshelf} size="sm" />
          <span
            className={clsx(
              "whitespace-nowrap text-base",
              initialBookshelf === bookshelf &&
                "font-semibold text-secondary dark:text-secondary-light"
            )}
          >
            {tb(bookshelf)}
          </span>
        </button>
      ))}
      {!!initialBookshelf && (
        <button
          className="flex items-center py-1.5"
          onClick={() => changedBookshelf(null)}
        >
          <span className="whitespace-nowrap text-base">
            {t("remove from shelf")}
          </span>
        </button>
      )}
    </div>
  );
};
