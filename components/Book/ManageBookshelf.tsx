"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";
import { type bookshelfType } from "@prisma/client";

import {
  BsBookmarkPlus,
  BsFillBookmarkCheckFill,
  BsFillBookmarkDashFill,
  BsFillBookmarkFill,
  BsFillBookmarksFill,
  BsFillBookmarkXFill,
} from "react-icons/bs";

import { dateFormater } from "~/utils/dateFormater";

import { ButtonLink } from "../ui/Buttons";
import { BookmarksWrapper } from "./BookmarksWrapper";

interface ManageBookshelfProps {
  bookshelf?: bookshelfType | null;
  title?: string | null;
  updatedAt?: Date | null;
}

export const ManageBookshelf: FC<ManageBookshelfProps> = ({
  bookshelf,
  title,
  updatedAt,
}) => {
  const t = useTranslations("Book.ManageBookshelf");
  const tb = useTranslations("BookselfTypes");

  const getBookshelfIcon = (bookshelf: bookshelfType) => {
    switch (bookshelf) {
      case "TO_READ":
        return <BookmarksWrapper Icon={BsFillBookmarkDashFill} color="blue" />;
      case "ALREADY_READ":
        return (
          <BookmarksWrapper Icon={BsFillBookmarkCheckFill} color="green" />
        );
      case "ABANDONED":
        return <BookmarksWrapper Icon={BsFillBookmarkXFill} color="red" />;
      case "READING":
        return <BookmarksWrapper Icon={BsFillBookmarkFill} color="gray" />;
      case "OTHER":
      default:
        <BookmarksWrapper Icon={BsFillBookmarksFill} color="default" />;
    }
  };

  return (
    <div className="flex gap-1">
      {bookshelf ? (
        getBookshelfIcon(bookshelf)
      ) : (
        <BookmarksWrapper Icon={BsBookmarkPlus} color="gradient" />
      )}

      <div className="flex flex-col">
        <ButtonLink className="self-start">{t("on a shelf")}</ButtonLink>
        <p>
          {bookshelf ? (bookshelf === "OTHER" ? title : tb(bookshelf)) : "–"}
        </p>

        {updatedAt ? (
          <p className="text-xs text-black-light dark:text-white-dark">
            {dateFormater(updatedAt)}
          </p>
        ) : (
          <p className="underline">{t("add to shelf")}</p>
        )}
      </div>
    </div>
  );
};
