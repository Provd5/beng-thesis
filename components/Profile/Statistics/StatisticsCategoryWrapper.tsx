"use client";

import { type FC } from "react";
import { useTranslations } from "next-intl";

interface StatisticsCategoryWrapperProps {
  children: React.ReactNode;
  variant?: "profile statistics" | "owned books" | "read books";
}

export const StatisticsCategoryWrapper: FC<StatisticsCategoryWrapperProps> = ({
  children,
  variant,
}) => {
  const t = useTranslations("Statistics.CategoryTitles");

  return (
    <div className="h-fit w-full rounded-md bg-colors-background p-5">
      {variant && (
        <h1 className="mb-3 text-center text-lg font-semibold text-colors-primary">
          {t(variant)}
        </h1>
      )}
      {children}
    </div>
  );
};
