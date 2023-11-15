"use client";

import type { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { ExploreIcon, ProfileIcon, SearchIcon } from "../ui/SvgIcons/NavIcons";

interface NavbarLinkProps {
  pageUrl: "login" | "profile" | "search" | null;
  fullname?: string | null;
}

export const NavbarLink: FC<NavbarLinkProps> = ({ fullname, pageUrl }) => {
  const t = useTranslations("Nav.CategoryTitles");

  const pathname = usePathname();
  const pathnameParts = pathname.split("/");

  const isActive = () => {
    if (!pathnameParts[2] && !pageUrl) return true;

    if (pathnameParts[2] !== "profile" && pathnameParts[2] === pageUrl)
      return true;

    if (
      pathnameParts[2] === "profile" &&
      fullname &&
      pathnameParts[3] === fullname
    )
      return true;

    return false;
  };

  return (
    <Link
      href={
        pageUrl === "profile" && fullname
          ? `/${pageUrl}/${fullname}/`
          : `/${pageUrl || ""}`
      }
      className={clsx(
        "flex flex-none items-center justify-center rounded-full hover:bg-white-light/50 dark:hover:bg-black-dark/50",
        pageUrl === "login" || pageUrl === "profile"
          ? "h-[52px] w-[52px]"
          : "h-[48px] w-[48px]",
        isActive() && "pointer-events-none cursor-default"
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
          {pageUrl === null && <ExploreIcon isActive={isActive()} />}
          {pageUrl === "search" && <SearchIcon isActive={isActive()} />}
        </div>
        <p
          className={clsx(
            "text-2xs",
            isActive() && "text-secondary dark:text-secondary-light"
          )}
        >
          {t(pageUrl || "explore")}
        </p>
      </div>
    </Link>
  );
};
