"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";
import { type bookshelfType } from "@prisma/client";
import clsx from "clsx";

import { getBookmarkIcon } from "~/components/ui/getBookmarkIcon";

interface ManageBookshelfModalContentProps {
  label: string;
  handleChangeBookshelfState: (bookshelf: bookshelfType | null) => void;
  currentBookshelf: bookshelfType | null;
}

export const ManageBookshelfModalContent: FC<
  ManageBookshelfModalContentProps
> = ({ label, handleChangeBookshelfState, currentBookshelf }) => {
  const tb = useTranslations("Book.BookshelfTypes");

  const bookshelfArray: bookshelfType[] = [
    "ALREADY_READ",
    "TO_READ",
    "ABANDONED",
    "READING",
    "OTHER",
  ];

  return (
    <div className="flex grow flex-col gap-2">
      {bookshelfArray.map((bookshelf) => (
        <button
          key={bookshelf}
          className="flex items-center gap-1 py-1.5"
          onClick={() => handleChangeBookshelfState(bookshelf)}
        >
          {getBookmarkIcon(bookshelf, "sm")}
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
          onClick={() => handleChangeBookshelfState(null)}
        >
          <span className="whitespace-nowrap text-base">{label}</span>
        </button>
      )}
    </div>
  );
};
