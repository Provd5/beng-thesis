"use client";

import type { FC } from "react";
import { type Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { MdNavigateBefore } from "react-icons/md";

interface BackCategoryLinkProps {
  variant: "RETURN" | "MY_REVIEW";
  hrefReplace?: boolean;
  href: Url;
}

export const BackCategoryLink: FC<BackCategoryLinkProps> = ({
  variant,
  hrefReplace = false,
  href,
}) => {
  const t = useTranslations("Book.BackCategoryLink");

  return (
    <div className="flex">
      <Link
        replace={hrefReplace}
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

export const BackCategoryButton: FC = () => {
  const t = useTranslations("Book.BackCategoryLink");
  const prevLocation = useSearchParams().get("from");

  return (
    <div className="flex">
      <Link
        href={prevLocation ? prevLocation : "/"}
        className="flex grow-0 items-center gap-3 md:justify-start"
      >
        <MdNavigateBefore className="fill-primary text-xl dark:fill-secondary-light" />
        <div className="text-lg font-semibold text-secondary dark:text-secondary-light">
          <h1>{t("RETURN")}</h1>
        </div>
      </Link>
    </div>
  );
};
