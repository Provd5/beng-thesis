"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { dateFormater } from "~/utils/dateFormater";

interface AlreadyReadStatisticsLabelsProps {
  variant:
    | "shortest-read:"
    | "longest-read:"
    | "last:"
    | "book with most pages:"
    | "most read book:";
  book: {
    title: string;
    authors: string[];
    page_count: number;
  };
  readQuantity?: number;
  readTime?: number;
  updateDate?: Date;
}

export const AlreadyReadStatisticsLabels: FC<
  AlreadyReadStatisticsLabelsProps
> = ({ variant, book, readQuantity, readTime, updateDate }) => {
  const t = useTranslations("Statistics.ReadBooks");

  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-secondary dark:text-secondary-light">{t(variant)}</h2>
      <div className="flex max-w-[250px] flex-col gap-0.5 text-sm">
        <h3 className="text-base font-semibold">{book.title}</h3>
        <p>{book.authors.join(", ")}</p>
        {book.page_count > 0 && (
          <p>
            {t("pages:")}{" "}
            <span
              className={
                variant === "book with most pages:"
                  ? "text-secondary dark:text-secondary-light"
                  : ""
              }
            >
              {book.page_count}
            </span>
          </p>
        )}
        {!!readQuantity && (
          <p>
            {t.rich("read quantity", {
              numRead: readQuantity,
              span: (chunks) => (
                <span className="text-secondary dark:text-secondary-light">
                  {chunks}
                </span>
              ),
            })}
          </p>
        )}
        {!!readTime && (
          <p>
            {t.rich("read in", {
              numDays: readTime,
              span: (chunks) => (
                <span className="text-secondary dark:text-secondary-light">
                  {chunks}
                </span>
              ),
            })}
          </p>
        )}
        {!!updateDate && (
          <p className="text-secondary dark:text-secondary-light">
            {dateFormater(updateDate)}
          </p>
        )}
      </div>
    </div>
  );
};
