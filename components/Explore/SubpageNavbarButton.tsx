"use client";

import type { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { BsBookFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";

import { locales, type localeTypes } from "~/i18n";

type ValidUrl = "explore" | "community";

interface SubpageNavbarButtonProps {
  pageUrl: ValidUrl;
}

export const SubpageNavbarButton: FC<SubpageNavbarButtonProps> = ({
  pageUrl,
}) => {
  const t = useTranslations("Explore.Page");

  const pathname = usePathname();

  const isActive = () => {
    const pathnameWithoutLocale: string[] | undefined = pathname
      .split("/")
      .filter((element) => !locales.includes(element as localeTypes));

    if (!pathnameWithoutLocale) return false;

    if (
      pathnameWithoutLocale[1] === pageUrl &&
      pathnameWithoutLocale[2] !== "community"
    )
      return true;

    if (
      pathnameWithoutLocale[1] === "explore" &&
      pathnameWithoutLocale[2] === pageUrl
    )
      return true;

    return false;
  };

  return (
    <Link
      href={pageUrl === "community" ? "/explore/community" : "/explore"}
      className={clsx(
        "flex h-full w-32 items-center justify-center gap-2 xs:w-36",
        isActive() && "border-b border-primary dark:border-secondary-light"
      )}
    >
      {pageUrl === "community" ? (
        <FaUsers
          className={clsx(
            "text-lg",
            isActive() &&
              "fill-[var(--svg-gradient-dark)] dark:fill-[var(--svg-gradient)]"
          )}
        />
      ) : (
        <BsBookFill
          className={clsx(
            "text-lg",
            isActive() &&
              "fill-[var(--svg-gradient-dark)] dark:fill-[var(--svg-gradient)]"
          )}
        />
      )}
      <span
        className={clsx(
          "hidden text-md xs:block",
          isActive() && "text-secondary dark:text-secondary-light"
        )}
      >
        {pageUrl === "community" ? t("community") : t("books")}
      </span>
    </Link>
  );
};
