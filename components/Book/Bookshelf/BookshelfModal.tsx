"use client";

import type { FC } from "react";
import { type FieldValues, type UseFormSetValue } from "react-hook-form";
import { useTranslations } from "next-intl";
import { type bookshelfType } from "@prisma/client";
import clsx from "clsx";

import { BookshelfArray } from "~/types/categoryArrays";

import { BookmarkIcon } from "~/components/ui/Icons/BookmarkIcon";

interface BookshelfModalProps {
  setValue: UseFormSetValue<FieldValues>;
  currentBookshelf: bookshelfType | null;
}

export const BookshelfModal: FC<BookshelfModalProps> = ({
  setValue,
  currentBookshelf,
}) => {
  const t = useTranslations("Book.ManageBookshelf");
  const tb = useTranslations("Book.BookshelfTypes");

  return (
    <div className="flex grow flex-col gap-2">
      {BookshelfArray.map((bookshelf) => (
        <button
          key={bookshelf}
          className="flex items-center gap-1 py-1.5"
          onClick={() => setValue("bookshelf", bookshelf)}
        >
          <BookmarkIcon category={bookshelf} size="sm" />
          <span
            className={clsx(
              "whitespace-nowrap text-base",
              currentBookshelf === bookshelf &&
                "font-semibold text-secondary dark:text-secondary-light"
            )}
          >
            {tb(bookshelf)}
          </span>
        </button>
      ))}
      {currentBookshelf && (
        <button
          className="flex items-center py-1.5"
          onClick={() => setValue("bookshelf", null)}
        >
          <span className="whitespace-nowrap text-base">
            {t("remove from shelf")}
          </span>
        </button>
      )}
    </div>
  );
};
