"use client";

import { type FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import FlagOfTheUnitedKingdom from "~/assets/flags/flag-icons-gb.png";
import FlagOfPoland from "~/assets/flags/flag-icons-pl.png";
import { locales, type localeTypes } from "~/i18n";

import { Loader } from "../ui/Loaders/Loader";

interface LanguageSwitcherProps {
  setCookie: (language: localeTypes) => void;
}

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ setCookie }) => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const localeFromUrl = pathnameParts[1];

  const [isLoading, setIsLoading] = useState(false);

  const getFlagFromLocale = (locale: localeTypes) => {
    switch (locale) {
      case "en":
        return {
          src: FlagOfTheUnitedKingdom,
          alt: "Flag Of The United Kingdom",
        };
      case "pl":
        return { src: FlagOfPoland, alt: "Flag of Poland" };
    }
  };

  return (
    <div className="flex flex-none gap-3">
      {isLoading ? (
        <Loader className="h-8 w-8" />
      ) : (
        locales.map((locale) => (
          <Link
            key={locale}
            className="flex flex-col items-center text-sm"
            onClick={() => {
              localeFromUrl !== locale &&
                (setCookie(locale), setIsLoading(true));
            }}
            href={pathname.replace(`/${localeFromUrl}`, `/${locale}`)}
            replace
          >
            <Image
              className={
                localeFromUrl === locale
                  ? "border border-transparent bg-gradient-dark dark:bg-gradient-light"
                  : "drop-shadow"
              }
              src={getFlagFromLocale(locale).src}
              alt={getFlagFromLocale(locale).alt}
              width={28}
              height={21}
              sizes="28px"
              priority
            />

            <p
              className={clsx(
                localeFromUrl === locale &&
                  "text-secondary dark:text-secondary-light",
                "font-semibold"
              )}
            >
              {locale.toUpperCase()}
            </p>
          </Link>
        ))
      )}
    </div>
  );
};
