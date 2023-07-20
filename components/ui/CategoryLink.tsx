"use client";

import type { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import {
  BsFillBookmarkCheckFill,
  BsFillBookmarkDashFill,
  BsFillBookmarkFill,
  BsFillBookmarkHeartFill,
  BsFillBookmarkStarFill,
  BsFillBookmarkXFill,
} from "react-icons/bs";
import { MdNavigateNext } from "react-icons/md";

type variantTypes =
  | "statistics"
  | "owned"
  | "liked"
  | "to-read"
  | "already-read"
  | "abadoned"
  | "reading"
  | "reviwes";

interface CategoryLinkProps {
  variant: variantTypes;
}

export const CategoryLink: FC<CategoryLinkProps> = ({ variant }) => {
  const t = useTranslations("Bookself");

  return (
    <div className="flex">
      <Link
        href={`/${variant}`}
        className="flex grow items-center justify-between gap-3 md:grow-0 md:justify-start"
      >
        <div className="mb-0.5 bg-gradient-dark bg-clip-text text-lg font-semibold text-transparent dark:bg-gradient-light">
          {variant === ("statistics" || "owned") ? (
            t(variant)
          ) : (
            <div className="flex items-center gap-1">
              {variant === "liked" && (
                <BsFillBookmarkHeartFill className="text-pink drop-shadow-icon" />
              )}
              {variant === "to-read" && (
                <BsFillBookmarkDashFill className="text-blue drop-shadow-icon" />
              )}
              {variant === "already-read" && (
                <BsFillBookmarkCheckFill className="text-green drop-shadow-icon" />
              )}
              {variant === "abadoned" && (
                <BsFillBookmarkXFill className="text-red drop-shadow-icon" />
              )}
              {variant === "reading" && (
                <BsFillBookmarkFill className="text-gray drop-shadow-icon" />
              )}
              {variant === "reviwes" && (
                <BsFillBookmarkStarFill className="text-yellow drop-shadow-icon" />
              )}
              <h1>{t(variant)}</h1>
            </div>
          )}
        </div>
        <MdNavigateNext className="fill-[var(--svg-gradient-dark)] text-xl dark:fill-[var(--svg-gradient)]" />
      </Link>
    </div>
  );
};
