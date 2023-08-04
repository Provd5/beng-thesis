"use client";

import type { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { locales, type localeTypes } from "~/i18n";

import { ExploreIcon, ProfileIcon, SearchIcon } from "./NavIcons";

type ValidUrl = "explore" | "login" | "profile" | "search";

interface NavbarLinkProps {
  pageUrl: ValidUrl;
  fullname?: string | null;
}

export const NavbarLink: FC<NavbarLinkProps> = ({ fullname, pageUrl }) => {
  const t = useTranslations("Nav.CategoryTitles");

  const pathname = usePathname();

  const isActive = () => {
    const pathnameWithoutLocale: string[] | undefined = pathname
      .split("/")
      .filter((element) => !locales.includes(element as localeTypes));

    if (!pathnameWithoutLocale) return false;

    if (
      pathnameWithoutLocale[1] !== "profile" &&
      pathnameWithoutLocale[1] === pageUrl
    )
      return true;

    if (
      pathnameWithoutLocale[1] === "profile" &&
      fullname &&
      pathnameWithoutLocale[2] === fullname
    )
      return true;

    return false;
  };

  return (
    <Link
      href={
        pageUrl === "profile" && fullname
          ? `/${pageUrl}/${fullname}`
          : `/${pageUrl}`
      }
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-full hover:bg-white-light/50 dark:hover:bg-black-dark/50",
        pageUrl === "login" || pageUrl === "profile"
          ? "h-[52px] w-[52px]"
          : "h-[48px] w-[48px]",
        isActive() &&
          "pointer-events-none cursor-default bg-white-light dark:bg-black-dark"
      )}
    >
      <div className="mt-[-4px] flex flex-col items-center justify-center gap-0.5">
        <div
          className={
            pageUrl === "login" || pageUrl === "profile" ? "h-7 w-7" : "h-6 w-6"
          }
        >
          {(pageUrl === "login" || pageUrl === "profile") && (
            <ProfileIcon isActive={isActive()} />
          )}
          {pageUrl === "explore" && <ExploreIcon isActive={isActive()} />}
          {pageUrl === "search" && <SearchIcon isActive={isActive()} />}
        </div>
        <p className="text-2xs">{t(pageUrl)}</p>
      </div>
    </Link>
  );
};
