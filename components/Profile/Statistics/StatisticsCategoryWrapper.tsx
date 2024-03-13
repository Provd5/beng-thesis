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
    <div className="h-fit w-full rounded-md bg-white-light p-5 dark:bg-black-dark sm:w-fit sm:max-w-[600px]">
      {variant && (
        <h1 className="mb-3 text-center text-lg font-semibold text-secondary dark:text-secondary-light">
          {t(variant)}
        </h1>
      )}
      {children}
    </div>
  );
};
