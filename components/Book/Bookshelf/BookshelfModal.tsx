"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";
import { type bookshelfType } from "@prisma/client";

import { BookshelfArray } from "~/types/consts";

import { BookmarkIcon } from "~/components/ui/Icons/BookmarkIcon";
import { cn } from "~/utils/cn";

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
    <div className="flex grow flex-col gap-1">
      {BookshelfArray.map((bookshelf) => (
        <button
          key={bookshelf}
          className={cn(
            "flex items-center gap-1 py-1.5 transition-transform",
            initialBookshelf !== bookshelf && "hover:translate-x-1"
          )}
          onClick={() => {
            changedBookshelf(bookshelf);
          }}
        >
          <BookmarkIcon category={bookshelf} size="sm" />
          <span
            className={cn(
              "whitespace-nowrap text-base",
              initialBookshelf === bookshelf &&
                "font-semibold text-colors-primary"
            )}
          >
            {tb(bookshelf)}
          </span>
        </button>
      ))}
      {!!initialBookshelf && (
        <button
          className="flex items-center gap-1 py-1.5 transition-transform hover:translate-x-1"
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
