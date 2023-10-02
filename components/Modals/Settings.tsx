"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { SlOptions } from "react-icons/sl";

import { type localeTypes } from "~/i18n";

import { LanguageSwitcher } from "../Switchers/LanguageSwitcher";
import { ThemeSwitcher } from "../Switchers/ThemeSwitcher";
import { ModalInitiator } from "./ModalInitiator";

interface SettingsProps {
  setLangCookie: (data: localeTypes) => Promise<void>;
}

export const Settings: FC<SettingsProps> = ({ setLangCookie }) => {
  const t = useTranslations("Nav.Settings");

  return (
    <>
      <ModalInitiator
        initiatorStyle={
          <div className="hover:scale-105">
            <SlOptions className="h-6 w-6" />
          </div>
        }
      >
        <div className="flex grow flex-col items-center gap-3 whitespace-nowrap">
          <p className="text-sm">{t("app style")}</p>
          <ThemeSwitcher />
          <p className="text-sm">{t("app language")}</p>
          <LanguageSwitcher setLangCookie={setLangCookie} />
        </div>
      </ModalInitiator>
    </>
  );
};
