"use client";

import type { FC } from "react";
import { type Url } from "next/dist/shared/lib/router/router";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { MdNavigateBefore } from "react-icons/md";

import { Link } from "~/i18n/routing";
import ROUTES from "~/utils/routes";

interface BackCategoryLinkProps {
  variant: "RETURN" | "MY_REVIEW";
  replace?: boolean;
  href: Url;
}

export const BackCategoryLink: FC<BackCategoryLinkProps> = ({
  variant,
  replace = false,
  href,
}) => {
  const t = useTranslations("Book.BackCategoryLink");

  return (
    <div className="flex">
      <Link
        replace={replace}
        href={href}
        className="flex grow items-center gap-3 transition-transform hover:-translate-x-1 md:grow-0 md:justify-start"
      >
        <MdNavigateBefore className="fill-colors-primary text-xl" />
        <div className="text-lg font-semibold text-colors-primary">
          <h1>{t(variant)}</h1>
        </div>
      </Link>
    </div>
  );
};

export const BackFrom: FC = () => {
  const t = useTranslations("Book.BackCategoryLink");
  const prevLocation = useSearchParams().get("from");

  return (
    <div className="flex">
      <Link
        href={prevLocation ? prevLocation : ROUTES.root}
        className="flex grow-0 items-center gap-3 transition-transform hover:-translate-x-1 md:justify-start"
      >
        <MdNavigateBefore className="fill-colors-primary text-xl" />
        <div className="text-lg font-semibold text-colors-primary">
          <h1>{t("RETURN")}</h1>
        </div>
      </Link>
    </div>
  );
};
