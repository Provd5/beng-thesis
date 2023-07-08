"use client";

import { type FC, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import FlagOfTheUnitedKingdom from "~/assets/flags/gb.svg";
import FlagOfPoland from "~/assets/flags/pl.svg";
import { type Locale } from "~/dictionaries";

interface LanguageSwitcherProps {
  currentLang: Locale;
  setLangCookie: (data: Locale) => Promise<void>;
}

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
  currentLang,
  setLangCookie,
}) => {
  const [language, setLanguage] = useState(currentLang);
  const router = useRouter();
  const pathnameArr = usePathname().split("/");

  const handleSetLanguage = (language: Locale) => {
    setLanguage(language);
    pathnameArr[1] = language;
    void setLangCookie(language).then(() => router.push(pathnameArr.join("/")));
  };

  return (
    <div className="flex gap-3">
      <button
        disabled={language === "en"}
        className="flex shrink-0 flex-col items-center text-sm"
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
        />
        <p
          className={
            (language === "en"
              ? "bg-gradient-dark bg-clip-text text-transparent dark:bg-gradient-light"
              : "") + " font-semibold"
          }
        >
          EN
        </p>
      </button>
      <button
        disabled={language === "pl"}
        className="flex shrink-0 flex-col items-center text-sm"
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
        />
        <p
          className={
            (language === "pl"
              ? "bg-gradient-dark bg-clip-text text-transparent dark:bg-gradient-light"
              : "") + " font-semibold"
          }
        >
          PL
        </p>
      </button>
    </div>
  );
};
