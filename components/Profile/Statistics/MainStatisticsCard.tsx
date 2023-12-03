import type { FC } from "react";

import { categoryArray, type CategoryTypes } from "~/types/CategoryTypes";

import { getBookmarkIcon } from "~/components/ui/getBookmarkIcon";
import { getOwnedAsIcon } from "~/components/ui/getOwnedAsIcon";
import { fetchCategoryCount } from "~/lib/actions/profile/fetch";

interface MainStatisticsCardProps {
  fullname: string;
}

export const MainStatisticsCard: FC<MainStatisticsCardProps> = async ({
  fullname,
}) => {
  const quantities = await Promise.all(
    categoryArray.map((categoryVariant) => ({
      [categoryVariant]: fetchCategoryCount(fullname, categoryVariant),
    }))
  );

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {quantities.map((categoryVariant) => {
        const label = Object.keys(categoryVariant)[0] as CategoryTypes;
        const value = categoryVariant[label];

        if (label === "STATISTICS") return null;

        return (
          <div
            key={label}
            className="flex flex-col items-center justify-center gap-0.5"
          >
            <div className="flex h-8 w-8 items-center justify-center">
              {label === "OWNED" ? (
                <div className="mb-[-4px]">{getOwnedAsIcon("BOOK", "lg")}</div>
              ) : (
                getBookmarkIcon(label, "lg")
              )}
            </div>
            <p className="flex h-8 items-center justify-center text-lg">
              {value}
            </p>
          </div>
        );
      })}
    </div>
  );
};
