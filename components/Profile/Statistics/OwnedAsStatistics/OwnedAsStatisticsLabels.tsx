"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

interface OwnedAsStatisticsLabelsProps {
  uniqueBooksQuantity: number;
  totalBooksQuantity: number;
}

export const OwnedAsStatisticsLabels: FC<OwnedAsStatisticsLabelsProps> = ({
  uniqueBooksQuantity,
  totalBooksQuantity,
}) => {
  const t = useTranslations("Statistics.OwnedBooks");

  return (
    <div className="flex flex-col">
      <h2 className="font-semibold">
        {t("unique:")}{" "}
        <span className="text-md text-secondary dark:text-secondary-light">
          {uniqueBooksQuantity}
        </span>
      </h2>
      <h2 className="font-semibold">
        {t("total in all forms:")}{" "}
        <span className="text-md text-secondary dark:text-secondary-light">
          {totalBooksQuantity}
        </span>
      </h2>
    </div>
  );
};
