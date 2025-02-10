"use client";

import type { FC } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { Link } from "~/i18n/routing";
import { getLocaleFromUrl } from "~/utils/getLocaleFromUrl";

interface LinkWithFromProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export const LinkWithFrom: FC<LinkWithFromProps> = ({
  href,
  className,
  children,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const localeFromPathname = getLocaleFromUrl(pathname);

  const pathnameWithoutLocale = localeFromPathname
    ? pathname.replace(`/${localeFromPathname}`, "")
    : "";

  const normalizedPathname = pathnameWithoutLocale.startsWith("/")
    ? pathnameWithoutLocale
    : `/${pathnameWithoutLocale}`;

  const query =
    searchParams.toString() === ""
      ? normalizedPathname
      : `${normalizedPathname}?${searchParams}`;

  return (
    <Link
      href={{
        pathname: href,
        query: query ? (from ? { from } : { from: query }) : {},
      }}
      className={className}
    >
      {children}
    </Link>
  );
};
