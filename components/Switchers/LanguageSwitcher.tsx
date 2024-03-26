"use client";

import { type FC } from "react";
import Image, { type StaticImageData } from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";

import { locales } from "~/i18n";
import FlagOfTheUnitedKingdom from "~/public/flags/flag-icons-gb.png";
import FlagOfPoland from "~/public/flags/flag-icons-pl.png";
import { getLocaleFromUrl } from "~/utils/getLocaleFromUrl";

export const LanguageSwitcher: FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const localeFromUrl = getLocaleFromUrl(pathname);

  return (
    <div className="flex flex-none gap-3">
      {locales.map((locale) => {
        let flagFromLocale: {
          src: StaticImageData;
          alt: string;
        };

        switch (locale) {
          case "en":
            flagFromLocale = {
              src: FlagOfTheUnitedKingdom,
              alt: "Flag Of The United Kingdom",
            };
            break;
          case "pl":
            flagFromLocale = { src: FlagOfPoland, alt: "Flag of Poland" };
            break;
        }

        return (
          <a
            key={locale}
            href={
              pathname.replace(`/${localeFromUrl}`, `/${locale}`) +
              `?${searchParams.toString()}`
            }
            className="flex flex-col items-center text-sm"
          >
            <Image
              className={
                localeFromUrl === locale
                  ? "border border-transparent bg-gradient-dark dark:bg-gradient-light"
                  : "drop-shadow"
              }
              src={flagFromLocale.src}
              alt={flagFromLocale.alt}
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
        );
      })}
    </div>
  );
};
