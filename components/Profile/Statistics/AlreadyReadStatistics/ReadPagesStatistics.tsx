"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

interface TotalReadPagesStatisticsProps {
  totalReadPages: number;
}

export const TotalReadPagesStatistics: FC<TotalReadPagesStatisticsProps> = ({
  totalReadPages,
}) => {
  const t = useTranslations("Statistics.ReadBooks");

  return (
    <h2 className="self-end font-semibold">
      {t("total pages read:")}{" "}
      <span className="text-secondary dark:text-secondary-light">
        {totalReadPages}
      </span>
    </h2>
  );
};
