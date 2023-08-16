"use client";

import type { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { MdNavigateBefore } from "react-icons/md";

import { type categoryTypes } from "~/types/categoryTypes";

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
        className="flex grow items-center gap-3 md:grow-0 md:justify-start"
      >
        <MdNavigateBefore className="fill-primary text-xl dark:fill-secondary-light" />
        <div className="text-lg font-semibold text-secondary dark:text-secondary-light">
          <h1>{t(variant)}</h1>
        </div>
      </Link>
    </div>
  );
};
