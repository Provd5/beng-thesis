"use client";

import type { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={
        "flex h-14 w-14 shrink-0 items-center justify-center rounded-full hover:bg-white-light/50 dark:hover:bg-black-dark/50" +
        (isActive ? " bg-white-light dark:bg-black-dark" : "")
      }
    >
      <div className="mt-[-4px] flex flex-col items-center justify-center">
        <svg className={big ? "h-8 w-8" : "h-7 w-7"}>
          <linearGradient id="myGradient" gradientTransform="rotate(75)">
            <stop stopColor="rgb(var(--primary-light))" offset="0%" />
            <stop stopColor="rgb(var(--secondary-light))" offset="100%" />
          </linearGradient>
          <linearGradient id="myGradientDark" gradientTransform="rotate(75)">
            <stop stopColor="rgb(var(--secondary-default))" offset="0%" />
            <stop stopColor="rgb(var(--primary-default))" offset="100%" />
          </linearGradient>
          {children}
        </svg>
        <p className="text-xs">{text}</p>
      </div>
    </Link>
  );
};
