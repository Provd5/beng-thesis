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
  href: ValidUrl;
  fullname?: string | null;
}

export const NavbarLink: FC<NavbarLinkProps> = ({ fullname, href }) => {
  const t = useTranslations("CategoryTitles");

  const pathname = usePathname();
  const pathnameWithoutLocale: string[] | undefined = pathname
    .split("/")
    .filter((element) => !locales.includes(element as localeTypes));

  const isActive =
    (fullname &&
      pathnameWithoutLocale[1] === "profile" &&
      pathnameWithoutLocale[2] === fullname) ||
    pathnameWithoutLocale[1] === href;

  return (
    <Link
      href={
        href === "profile" && fullname ? `/${href}/${fullname}` : `/${href}`
      }
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-full hover:bg-white-light/50 dark:hover:bg-black-dark/50",
        href === "login" || href === "profile"
          ? "h-[52px] w-[52px]"
          : "h-[48px] w-[48px]",
        isActive &&
          "pointer-events-none cursor-default bg-white-light dark:bg-black-dark"
      )}
    >
      <div className="mt-[-4px] flex flex-col items-center justify-center gap-0.5">
        <div
          className={
            href === "login" || href === "profile" ? "h-7 w-7" : "h-6 w-6"
          }
        >
          {(href === "login" || href === "profile") && (
            <ProfileIcon isActive={isActive} />
          )}
          {href === "explore" && <ExploreIcon isActive={isActive} />}
          {href === "search" && <SearchIcon isActive={isActive} />}
        </div>
        <p className="text-2xs">{t(href)}</p>
      </div>
    </Link>
  );
};
