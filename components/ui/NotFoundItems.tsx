"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

interface NotFoundItemsProps {
  itemType?: "reviews";
}

export const NotFoundItems: FC<NotFoundItemsProps> = ({ itemType }) => {
  const t = useTranslations("NotFound.NotFoundItems");

  return (
    <>
      <div className="mt-6 flex flex-col justify-center gap-3 p-6 text-center text-md text-gray">
        <h1>
          {itemType === "reviews"
            ? t("this book has no written reviews yet")
            : t("nothing found")}
        </h1>
        <span className="text-xl">🕸️</span>
      </div>
    </>
  );
};
