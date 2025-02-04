"use client";

import type { FC } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { BsBookFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";

import { Link } from "~/i18n/routing";
import { cn } from "~/utils/cn";
import ROUTES from "~/utils/routes";

interface SubpageNavbarButtonProps {
  pageVariant: "community" | "explore";
}

export const SubpageNavbarButton: FC<SubpageNavbarButtonProps> = ({
  pageVariant,
}) => {
  const t = useTranslations("Explore.Page");

  const pageRoutes = {
    community: ROUTES.community,
    explore: ROUTES.root,
  };

  const pathname = usePathname();
  const isCommunityPage = pathname.split("/").includes("community");

  const isActive = () => {
    if (pageVariant === "community" && isCommunityPage) return true;

    if (pageVariant === "explore" && !isCommunityPage) return true;

    return false;
  };

  return (
    <Link
      href={pageRoutes[pageVariant]}
      className={cn(
        "flex h-full w-32 items-center justify-center gap-2 transition-transform",
        isActive() && "border-b border-colors-primary",
        !isActive() && "hover:-translate-y-1",
      )}
    >
      {pageVariant === "community" ? (
        <FaUsers
          className={cn("text-lg", isActive() && "fill-colors-primary")}
        />
      ) : (
        <BsBookFill
          className={cn("text-lg", isActive() && "fill-colors-primary")}
        />
      )}
      <span
        className={cn(
          "text-md hidden sm:block",
          isActive() && "text-colors-primary",
        )}
      >
        {pageVariant === "community" ? t("community") : t("books")}
      </span>
    </Link>
  );
};
