"use client";

import { type FC } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { locales, type localeTypes } from "~/i18n";
import FlagOfTheUnitedKingdom from "~/public/flags/flag-icons-gb.png";
import FlagOfPoland from "~/public/flags/flag-icons-pl.png";

export const LanguageSwitcher: FC = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const localeFromUrl = pathnameParts[1];

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
      {locales.map((locale) => (
        <a
          key={locale}
          href={pathname.replace(`/${localeFromUrl}`, `/${locale}`)}
          className="flex flex-col items-center text-sm"
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
        </a>
      ))}
    </div>
  );
};
