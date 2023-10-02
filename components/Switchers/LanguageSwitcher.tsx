"use client";

import { type FC, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

import FlagOfTheUnitedKingdom from "~/assets/flags/gb.svg";
import FlagOfPoland from "~/assets/flags/pl.svg";
import { locales, type localeTypes } from "~/i18n";

interface LanguageSwitcherProps {
  setLangCookie: (data: localeTypes) => Promise<void>;
}

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
  setLangCookie,
}) => {
  const pathnameArr = usePathname().split("/");
  const router = useRouter();
  const [language, setLanguage] = useState(pathnameArr[1]);

  const handleSetLanguage = (language: localeTypes) => {
    setLanguage(language);
    pathnameArr[1] = language;
    void setLangCookie(language).then(() => router.push(pathnameArr.join("/")));
  };

  const getFlagFromLocale = (locale: localeTypes) => {
    switch (locale) {
      case "en":
        return {
          src: FlagOfTheUnitedKingdom as string,
          alt: "Flag Of The United Kingdom",
        };
      case "pl":
        return { src: FlagOfPoland as string, alt: "Flag of Poland" };
    }
  };

  return (
    <div className="flex flex-none gap-3">
      {locales.map((locale) => (
        <button
          key={locale}
          disabled={language === locale}
          className="flex flex-col items-center text-sm"
          onClick={() => handleSetLanguage(locale)}
        >
          <Image
            className={
              language === locale
                ? "border border-transparent bg-gradient-dark dark:bg-gradient-light"
                : ""
            }
            src={getFlagFromLocale(locale).src}
            alt={getFlagFromLocale(locale).alt}
            width={28}
            height={21}
            sizes="28px"
          />
          <p
            className={clsx(
              language === locale && "text-secondary dark:text-secondary-light",
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
