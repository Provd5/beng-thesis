"use client";

import type { FC } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { Link } from "~/i18n/routing";
import { getLocaleFromUrl } from "~/utils/getLocaleFromUrl";
import ROUTES from "~/utils/routes";

interface LinkToBookProps {
  bookId: string;
  bookTitle: string;
  className?: string;
  children: React.ReactNode;
}

export const LinkToBook: FC<LinkToBookProps> = ({
  bookId,
  bookTitle,
  className,
  children,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams().toString();

  const localeFromPathname = getLocaleFromUrl(pathname);

  const pathnameWithoutLocale =
    pathname.replace(`/${localeFromPathname}`, "") || "";

  const normalizedPathname = pathnameWithoutLocale.startsWith("/")
    ? pathnameWithoutLocale
    : `/${pathnameWithoutLocale}`;

  const query =
    searchParams === ""
      ? normalizedPathname
      : `${normalizedPathname}?${searchParams}`;

  return (
    <Link
      href={{
        pathname: ROUTES.book.root(bookId, bookTitle),
        query: query ? { from: query } : {},
      }}
      className={className}
    >
      {children}
    </Link>
  );
};
