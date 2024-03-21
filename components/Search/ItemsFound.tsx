import type { FC } from "react";
import { useTranslations } from "next-intl";

interface ItemsFoundProps {
  itemsFound: number;
}

export const ItemsFound: FC<ItemsFoundProps> = ({ itemsFound }) => {
  const t = useTranslations("Search");

  return (
    <div className="mt-3 flex items-center gap-1 whitespace-nowrap">
      <span className="py-0.5">{t("items found:")}</span>
      <span className="text-secondary dark:text-secondary-light">
        {itemsFound}
      </span>
    </div>
  );
};
