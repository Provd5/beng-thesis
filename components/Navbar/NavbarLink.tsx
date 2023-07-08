"use client";

import type { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { type Locale, locales } from "~/dictionaries";

import { SvgPainter } from "../ui/SvgPainter";

interface NavbarLinkProps {
  href: `/${string}`;
  text: string;
  children: React.ReactNode;
  big?: boolean;
}

export const NavbarLink: FC<NavbarLinkProps> = ({
  href,
  text,
  children,
  big,
}) => {
  const pathname = usePathname();
  const pathnameWithoutLocale: string[] | undefined = pathname
    .split("/")
    .filter((element) => !locales.includes(element as Locale));

  const isActive = (pathnameWithoutLocale[1] ?? "") === href.split("/")[1];

  return (
    <Link
      href={href}
      className={
        "flex h-14 w-14 shrink-0 items-center justify-center rounded-full hover:bg-white-light/50 dark:hover:bg-black-dark/50" +
        (isActive ? " bg-white-light dark:bg-black-dark" : "")
      }
    >
      <div className="mt-[-4px] flex flex-col items-center justify-center">
        <SvgPainter className={big ? "h-8 w-8" : "h-7 w-7"}>
          {children}
        </SvgPainter>
        <p className="text-xs">{text}</p>
      </div>
    </Link>
  );
};
