"use client";

import { type FC, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

import FlagOfTheUnitedKingdom from "~/assets/flags/gb.svg";
import FlagOfPoland from "~/assets/flags/pl.svg";
import { type localeTypes } from "~/i18n";

interface LanguageSwitcherProps {
  currentLang: localeTypes;
  setLangCookie: (data: localeTypes) => Promise<void>;
}

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
  currentLang,
  setLangCookie,
}) => {
  const [language, setLanguage] = useState(currentLang);
  const router = useRouter();
  const pathnameArr = usePathname().split("/");

  const handleSetLanguage = (language: localeTypes) => {
    setLanguage(language);
    pathnameArr[1] = language;
    void setLangCookie(language).then(() => router.push(pathnameArr.join("/")));
  };

  return (
    <div className="flex flex-none gap-3">
      <button
        disabled={language === "en"}
        className="flex flex-col items-center text-sm"
        onClick={() => handleSetLanguage("en")}
      >
        <Image
          className={
            language === "en"
              ? "border border-transparent bg-gradient-dark dark:bg-gradient-light"
              : ""
          }
          src={FlagOfTheUnitedKingdom as string}
          alt="Flag Of The United Kingdom"
          width={28}
          height={21}
          sizes="28px"
        />
        <p
          className={clsx(
            language === "en" && "text-secondary dark:text-secondary-light",
            "font-semibold"
          )}
        >
          EN
        </p>
      </button>
      <button
        disabled={language === "pl"}
        className="flex flex-col items-center text-sm"
        onClick={() => handleSetLanguage("pl")}
      >
        <Image
          className={
            language === "pl"
              ? "border border-transparent bg-gradient-dark dark:bg-gradient-light"
              : ""
          }
          src={FlagOfPoland as string}
          alt="Flag of Poland"
          width={28}
          height={21}
          sizes="28px"
        />
        <p
          className={clsx(
            language === "pl" && "text-secondary dark:text-secondary-light",
            "font-semibold"
          )}
        >
          PL
        </p>
      </button>
    </div>
  );
};
