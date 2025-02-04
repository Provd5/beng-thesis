"use client";

import type { FC } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { Link, routing } from "~/i18n/routing";
import { cn } from "~/utils/cn";
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
      ? `${ROUTES.profile.root(profileName)}`
      : ROUTES.profile.session_profile,
    search: ROUTES.search,
    explore: ROUTES.root,
  };

  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const localeShift = routing.locales.includes(pathnameParts[1]) ? 1 : 0;

  const isActive = () => {
    switch (pageVariant) {
      case "explore":
        if (
          pathnameParts[1 + localeShift] === "community" ||
          !pathnameParts[1 + localeShift]
        )
          return true;
        break;
      case "login":
      case "search":
        if (pathnameParts[1 + localeShift] === pageVariant) return true;
        break;
      case "profile":
        if (
          pathnameParts[1 + localeShift] === pageVariant &&
          !!profileName &&
          pathnameParts[2 + localeShift] === profileName
        )
          return true;
        break;
      default:
        return false;
    }

    return false;
  };

  return (
    <Link
      href={pageRoutes[pageVariant]}
      className={cn(
        "flex items-center justify-center rounded-full transition-all md:rounded-lg md:px-2 md:py-3",
        pageVariant === "login" || pageVariant === "profile"
          ? "max-md:size-[58px]"
          : "max-md:size-[48px]",
        isActive() && "pointer-events-none cursor-default",
        !isActive() && "hover:scale-95 hover:bg-colors-text/10",
      )}
    >
      <div className="flex flex-col items-center justify-center gap-0.5 md:flex-row-reverse md:gap-1.5">
        <div
          className={
            pageVariant === "login" || pageVariant === "profile"
              ? "size-7"
              : "size-6"
          }
        >
          {(pageVariant === "login" || pageVariant === "profile") && (
            <ProfileIcon isActive={isActive()} />
          )}
          {pageVariant === "explore" && <ExploreIcon isActive={isActive()} />}
          {pageVariant === "search" && <SearchIcon isActive={isActive()} />}
        </div>
        <p
          className={cn(
            "whitespace-nowrap text-center text-xs md:text-base",
            isActive() && "text-colors-primary",
          )}
        >
          {t(pageVariant)}
        </p>
      </div>
    </Link>
  );
};
