"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { Loader } from "../ui/Loader";

interface FetchMoreButtonProps {
  isLoading: boolean;
  fetchMoreFunc: () => void;
  className: string;
  takeLimit: number;
  pageNumber: number;
  dataLength: number;
}

export const FetchMoreButton: FC<FetchMoreButtonProps> = ({
  isLoading,
  fetchMoreFunc,
  className,
  takeLimit,
  pageNumber,
  dataLength,
}) => {
  const t = useTranslations("Other");

  return (
    // <div className="flex w-full items-center justify-center py-6">
    isLoading ? (
      <div className={className}>
        <Loader className="h-11 w-11" />
      </div>
    ) : (
      takeLimit * pageNumber - takeLimit <= dataLength && (
        <div className={className}>
          <button
            className="rounded-sm border border-secondary px-6 py-3 text-secondary dark:border-secondary-light dark:text-secondary-light"
            onClick={() => fetchMoreFunc()}
          >
            {t("load more")}
          </button>
        </div>
      )
    )
  );
};
