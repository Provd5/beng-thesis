"use client";

import type { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { MdNavigateBefore } from "react-icons/md";

import { type categoryTypes } from "./CategoryLink";

interface BackCategoryLinkProps {
  variant: categoryTypes;
  href: `/${string}`;
}

export const BackCategoryLink: FC<BackCategoryLinkProps> = ({
  variant,
  href,
}) => {
  const t = useTranslations("Book.BookselfTypes");

  return (
    <div className="flex">
      <Link
        href={href}
        className="flex grow items-center justify-between gap-1 md:grow-0 md:justify-start"
      >
        <MdNavigateBefore className="fill-[var(--svg-gradient-dark)] text-xl dark:fill-[var(--svg-gradient)]" />
        <div className="bg-gradient-dark bg-clip-text text-md font-semibold text-transparent dark:bg-gradient-light">
          <h1>{t(variant)}</h1>
        </div>
      </Link>
    </div>
  );
};
