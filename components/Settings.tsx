"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { SlOptions } from "react-icons/sl";

import { type localeTypes } from "~/i18n";

import { ModalInitiator } from "./Modals/ModalInitiator";
import { LanguageSwitcher } from "./Switchers/LanguageSwitcher";
import { ThemeSwitcher } from "./Switchers/ThemeSwitcher";

interface SettingsProps {
  setLangCookie: (data: localeTypes) => Promise<void>;
  currentLang: localeTypes;
}

export const Settings: FC<SettingsProps> = ({ setLangCookie, currentLang }) => {
  const t = useTranslations("Settings");

  return (
    <>
      <ModalInitiator
        initiatorStyle={
          <div className="hover:scale-105">
            <SlOptions className="text-lg" />
          </div>
        }
      >
        <div className="flex grow flex-col items-center gap-3">
          <p className="text-xs">{t("app style")}</p>
          <ThemeSwitcher />
          <p className="text-xs">{t("app language")}</p>
          <LanguageSwitcher
            currentLang={currentLang}
            setLangCookie={setLangCookie}
          />
        </div>
      </ModalInitiator>
    </>
  );
};
