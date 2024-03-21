"use client";

import type { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import ROUTES from "~/utils/routes";

import {
  ExploreIcon,
  ProfileIcon,
  SearchIcon,
} from "../../ui/Icons/SvgIcons/NavIcons";

interface NavbarLinkProps {
  pageVariant: "login" | "profile" | "search" | "explore";
  profileName?: string | null;
}

export const NavbarLink: FC<NavbarLinkProps> = ({
  profileName,
  pageVariant,
}) => {
  const t = useTranslations("Nav.CategoryTitles");

  const pageRoutes = {
    login: ROUTES.auth.login,
    profile: profileName
      ? ROUTES.profile.root(profileName)
      : ROUTES.profile.session_profile,
    search: ROUTES.search,
    explore: ROUTES.root,
  };

  const pathname = usePathname();
  const pathnameParts = pathname.split("/");

  const isActive = () => {
    if (!pathnameParts[2] && pageVariant === "explore") return true;

    if (pathnameParts[2] !== "profile" && pathnameParts[2] === pageVariant)
      return true;

    if (
      pathnameParts[2] === "profile" &&
      profileName &&
      pathnameParts[3] === profileName
    )
      return true;

    return false;
  };

  return (
    <Link
      href={pageRoutes[pageVariant]}
      className={clsx(
        "flex flex-none items-center justify-center rounded-full hover:bg-white-light/50 dark:hover:bg-black-dark/50 md:rounded-sm md:px-2 md:py-3",
        pageVariant === "login" || pageVariant === "profile"
          ? "max-md:h-[52px] max-md:w-[52px]"
          : "max-md:h-[48px] max-md:w-[48px]",
        isActive() && "pointer-events-none cursor-default"
      )}
    >
      <div className="flex flex-col items-center justify-center gap-0.5 max-md:mt-[-4px] md:flex-row-reverse md:gap-1.5">
        <div
          className={
            pageVariant === "login" || pageVariant === "profile"
              ? "h-7 w-7"
              : "h-6 w-6"
          }
        >
          {(pageVariant === "login" || pageVariant === "profile") && (
            <ProfileIcon isActive={isActive()} />
          )}
          {pageVariant === "explore" && <ExploreIcon isActive={isActive()} />}
          {pageVariant === "search" && <SearchIcon isActive={isActive()} />}
        </div>
        <p
          className={clsx(
            "text-2xs md:text-base",
            isActive() && "text-secondary dark:text-secondary-light"
          )}
        >
          {t(pageVariant)}
        </p>
      </div>
    </Link>
  );
};
