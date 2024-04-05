"use client";

import { type FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { MdNavigateNext } from "react-icons/md";

import ROUTES from "~/utils/routes";

interface ProfileSubpageLinkProps {
  profileName: string;
  variant: "followers" | "following" | "statistics";
  quantity: number;
}

export const ProfileSubpageLink: FC<ProfileSubpageLinkProps> = ({
  profileName,
  variant,
  quantity,
}) => {
  const t = useTranslations("Profile.Page");
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");

  const pageRoutes = {
    followers: ROUTES.profile.followers(profileName),
    following: ROUTES.profile.following(profileName),
    statistics: ROUTES.profile.statistics(profileName),
  };

  const isActive = () => {
    if (pathnameParts[4] === variant) return true;

    return false;
  };

  return (
    <Link
      href={pageRoutes[variant]}
      className={clsx(isActive() && "pointer-events-none")}
    >
      <div
        className={clsx(
          "flex w-fit items-center",
          isActive() && "text-secondary dark:text-secondary-light"
        )}
      >
        <h1 className="py-0.5 font-semibold">{t(variant)}</h1>
        {quantity > 0 && <p>: {quantity}</p>}
        {!isActive() && <MdNavigateNext className="text-lg" />}
      </div>
    </Link>
  );
};
