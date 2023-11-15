"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

interface SettingsLabelProps {
  label: "app style" | "app language";
}

export const SettingsLabel: FC<SettingsLabelProps> = ({ label }) => {
  const t = useTranslations("Nav.Settings");

  return (
    <>
      <p className="text-sm">{t(label)}</p>
    </>
  );
};
