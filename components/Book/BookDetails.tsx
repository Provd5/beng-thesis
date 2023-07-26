"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

interface BookDetailsProps {
  children: React.ReactNode;
  variant:
    | "pages:"
    | "publisher:"
    | "release date:"
    | "genre:"
    | "averge score:";
}

export const BookDetails: FC<BookDetailsProps> = ({ children, variant }) => {
  const t = useTranslations("Book.Details");

  return variant === "averge score:" ? (
    <div className="flex flex-col flex-wrap gap-0.5">
      <h3 className="bg-gradient-dark bg-clip-text font-semibold text-transparent dark:bg-gradient-light">
        {t(variant)}
      </h3>
      <p className="text-md font-medium">{children}</p>
    </div>
  ) : (
    <div className="flex flex-wrap gap-1">
      <h3 className="font-medium">{t(variant)}</h3>
      <p>{children}</p>
    </div>
  );
};
