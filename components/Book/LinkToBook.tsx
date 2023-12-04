"use client";

import type { FC } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

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

  const localeFromPathname = pathname?.split("/")?.[1];
  const pathnameWithoutLocale =
    pathname?.replace(`/${localeFromPathname}`, "") || "";
  const normalizedPathname = pathnameWithoutLocale.startsWith("/")
    ? pathnameWithoutLocale
    : `/${pathnameWithoutLocale}`;

  const query = `${normalizedPathname}?${searchParams}`;

  const href = {
    pathname: `/book/${bookId}/${bookTitle}`,
    query: { from: query },
  };

  return (
    <Link href={href} className={className} scroll={false}>
      {children}
    </Link>
  );
};
