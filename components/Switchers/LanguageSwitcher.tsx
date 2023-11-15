"use client";

import { type FC } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

import FlagOfTheUnitedKingdom from "~/assets/flags/flag-icons-gb.png";
import FlagOfPoland from "~/assets/flags/flag-icons-pl.png";
import { locales, type localeTypes } from "~/i18n";

interface LanguageSwitcherProps {
  setCookie: (language: localeTypes) => void;
}

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ setCookie }) => {
  const pathname = usePathname();
  const pathnameArray = pathname.split("/");
  const localeFromUrl = pathnameArray[1];

  const router = useRouter();

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
        <button
          key={locale}
          disabled={localeFromUrl === locale}
          className="flex flex-col items-center text-sm"
          onClick={() => {
            setCookie(locale), (pathnameArray[1] = locale);
            router.push(pathnameArray.join("/"));
          }}
        >
          <Image
            className={
              localeFromUrl === locale
                ? "border border-transparent bg-gradient-dark dark:bg-gradient-light"
                : ""
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
        </button>
      ))}
    </div>
  );
};
