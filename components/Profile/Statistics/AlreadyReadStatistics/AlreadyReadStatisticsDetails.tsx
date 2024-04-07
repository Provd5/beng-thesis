"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { type ReadBooksInterface } from "~/types/data/statistics";

import { SmallBookCard } from "~/components/Book/SmallBookCard";
import { dateFormater } from "~/utils/dateFormater";

interface AlreadyReadStatisticsDetailsProps {
  readBooks: ReadBooksInterface;
}

export const AlreadyReadStatisticsDetails: FC<
  AlreadyReadStatisticsDetailsProps
> = ({ readBooks }) => {
  const t = useTranslations("Statistics.ReadBooks");

  if (!readBooks.lastRead || !readBooks.updatedAt)
    return <h1>{t("no read books")}</h1>;

  return (
    <div className="mx-auto flex flex-col gap-3">
      <div className="flex flex-col justify-center gap-x-6 gap-y-3 md:flex-row">
        <div className="flex flex-col items-center">
          <h2 className="font-semibold">{t("last change:")}</h2>
          <span>{dateFormater(readBooks.updatedAt)}</span>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="font-semibold">{t("last read:")}</h2>
          <SmallBookCard bookData={readBooks.lastRead} />
        </div>
        {readBooks.mostRead && readBooks.mostRead.read_quantity > 0 && (
          <div className="flex flex-col items-center">
            <h2 className="font-semibold">{t("most read book:")}</h2>
            <SmallBookCard bookData={readBooks.mostRead.book} />

            <p>
              {t.rich("read quantity", {
                numRead: readBooks.mostRead.read_quantity,
                span: (chunks) => (
                  <span className="text-colors-primary">{chunks}</span>
                ),
              })}
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center">
        <h2 className="font-semibold">
          {t("total books read:")}
          <span className="text-md text-colors-primary">
            {" "}
            {readBooks.totalRead}
          </span>
        </h2>
        <h2 className="font-semibold">
          {t("total pages read:")}{" "}
          <span className="text-md text-colors-primary">
            {readBooks.totalReadPages}
          </span>
        </h2>
      </div>
    </div>
  );
};
