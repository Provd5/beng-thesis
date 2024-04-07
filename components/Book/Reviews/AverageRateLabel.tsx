"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

export const AverageRateLabel: FC = () => {
  const t = useTranslations("Book.BookCard");

  return <h3 className="text-base text-colors-primary">{t("rate")}</h3>;
};
