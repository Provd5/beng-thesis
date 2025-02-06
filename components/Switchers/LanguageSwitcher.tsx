"use client";

import { type FC } from "react";
import Image, { type StaticImageData } from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

import { locales } from "~/i18n/routing";
import FlagOfTheUnitedKingdom from "~/public/flags/flag-icons-gb.png";
import FlagOfPoland from "~/public/flags/flag-icons-pl.png";
import { cn } from "~/utils/cn";
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
          default:
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
            className="flex flex-col items-center text-sm transition-transform hover:scale-110"
          >
            <Image
              className={cn(
                "border-2 border-transparent",
                localeFromUrl === locale && "border-colors-primary",
              )}
              src={flagFromLocale.src}
              alt={flagFromLocale.alt}
              width={28}
              height={21}
              sizes="28px"
              priority
            />

            <p
              className={cn(
                localeFromUrl === locale && "text-colors-primary",
                "font-semibold",
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
