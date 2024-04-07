"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { FaCog } from "react-icons/fa";

import { LanguageSwitcher } from "../Switchers/LanguageSwitcher";
import { ThemeSwitcher } from "../Switchers/ThemeSwitcher";
import { ModalInitiator } from "./ModalInitiator";

export const Settings: FC = ({}) => {
  const t = useTranslations("Nav.Settings");

  return (
    <>
      <ModalInitiator
        initiatorStyle={
          <div className="transition-transform hover:rotate-90 hover:scale-110">
            <FaCog className="size-6" />
          </div>
        }
      >
        <div className="flex grow flex-col items-center gap-3 whitespace-nowrap">
          <p className="text-sm">{t("app style")}</p>
          <ThemeSwitcher />

          <p className="text-sm">{t("app language")}</p>
          <LanguageSwitcher />
        </div>
      </ModalInitiator>
    </>
  );
};
