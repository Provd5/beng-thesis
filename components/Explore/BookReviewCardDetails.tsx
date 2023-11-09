"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { dateFormater } from "~/utils/dateFormater";

interface BookReviewCardDetailsProps {
  rate: number;
  createdAt: Date;
  updatedAt: Date | null;
  text: string | null;
  okReactions: number;
}

export const BookReviewCardDetails: FC<BookReviewCardDetailsProps> = ({
  rate,
  createdAt,
  updatedAt,
  text,
  okReactions,
}) => {
  const t = useTranslations("Reviews.BookReviewCard");

  return (
    <>
      <div className="mt-1 flex flex-col gap-1">
        <h1>
          {t("your rate:")}{" "}
          <span className="text-secondary dark:text-secondary-light">{`${rate}/5`}</span>
        </h1>
        <h2 className="flex text-xs text-black-light dark:text-white-dark">
          {t("posted:")} {dateFormater(createdAt, true)}
          {updatedAt && ` / ${t("edited:")} ${dateFormater(updatedAt, true)}`}
        </h2>
      </div>
      {text && (
        <div>
          <p className="py-1 pl-1">{text}</p>
          {okReactions > 0 && (
            <p className="text-xs text-black-light dark:text-white-dark">
              {t.rich("users found this review helpful", {
                numUsers: okReactions,
                span: (chunks) => (
                  <span className="text-secondary dark:text-secondary-light">
                    {chunks}
                  </span>
                ),
              })}
            </p>
          )}
        </div>
      )}
    </>
  );
};
