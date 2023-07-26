"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

interface BookDetailsProps {
  text: string;
  variant:
    | "pages:"
    | "publisher:"
    | "release date:"
    | "genre:"
    | "averge score:"
    | "description:";
  col?: boolean;
}

export const BookDetails: FC<BookDetailsProps> = ({ text, variant, col }) => {
  const t = useTranslations("Book.Details");

  return variant === "averge score:" ? (
    <div className="flex flex-col gap-0.5">
      <h3 className="bg-gradient-dark bg-clip-text font-semibold text-transparent dark:bg-gradient-light">
        {t(variant)}
      </h3>
      <p className="text-md font-medium">{text}</p>
    </div>
  ) : (
    <div className={clsx("flex gap-1", !col ? "flex-wrap" : "flex-col")}>
      <h3 className="font-medium">{t(variant)}</h3>
      <p>{text}</p>
    </div>
  );
};
