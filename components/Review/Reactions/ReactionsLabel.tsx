import type { FC } from "react";
import { useTranslations } from "next-intl";

export const ReactionsLabel: FC = () => {
  const t = useTranslations("Reviews.Review");

  return <p className="text-right text-xs">{t("was this review helpful?")}</p>;
};
