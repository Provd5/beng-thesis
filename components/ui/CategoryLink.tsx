"use client";

import type { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { type bookshelfType } from "@prisma/client";

import {
  BsFillBookmarkCheckFill,
  BsFillBookmarkDashFill,
  BsFillBookmarkFill,
  BsFillBookmarkHeartFill,
  BsFillBookmarkStarFill,
  BsFillBookmarkXFill,
} from "react-icons/bs";
import { MdNavigateNext } from "react-icons/md";

export type categoryTypes = bookshelfType | "OWNED" | "LIKED" | "REVIEWS";

interface CategoryLinkProps {
  variant: categoryTypes | "STATISTICS";
  href: `/${string}`;
  withoutIcon?: boolean;
  quantity?: number;
}

export const CategoryLink: FC<CategoryLinkProps> = ({
  variant,
  href,
  withoutIcon,
  quantity,
}) => {
  const t = useTranslations("Book.BookselfTypes");

  const getBookshelfIcon = (bookshelf: categoryTypes | "STATISTICS") => {
    switch (bookshelf) {
      case "LIKED":
        return (
          <BsFillBookmarkHeartFill className="text-pink drop-shadow-icon" />
        );
      case "TO_READ":
        return (
          <BsFillBookmarkDashFill className="text-blue drop-shadow-icon" />
        );
      case "ALREADY_READ":
        return (
          <BsFillBookmarkCheckFill className="text-green drop-shadow-icon" />
        );
      case "ABANDONED":
        return <BsFillBookmarkXFill className="text-red drop-shadow-icon" />;
      case "READING":
        return <BsFillBookmarkFill className="text-gray drop-shadow-icon" />;
      case "REVIEWS":
        return (
          <BsFillBookmarkStarFill className="text-yellow drop-shadow-icon" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full">
      <Link
        href={href}
        className="flex grow items-center justify-between gap-3 md:grow-0 md:justify-start"
      >
        <div className="bg-gradient-dark bg-clip-text text-lg font-semibold text-transparent dark:bg-gradient-light">
          <div className="flex items-center gap-1">
            {!withoutIcon && getBookshelfIcon(variant)}
            <h1>
              {t(variant)}
              {quantity !== undefined && ` – ${quantity}`}
            </h1>
          </div>
        </div>
        <MdNavigateNext className="fill-[var(--svg-gradient-dark)] text-xl dark:fill-[var(--svg-gradient)]" />
      </Link>
    </div>
  );
};
