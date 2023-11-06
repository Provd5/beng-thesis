import type { FC } from "react";
import { type bookshelfType } from "@prisma/client";

import { categoryArray } from "~/types/CategoryTypes";

import { getBookmarkIcon } from "~/components/ui/getBookmarkIcon";
import { getOwnedAsIcon } from "~/components/ui/getOwnedAsIcon";
import { quantityPerCategoryType } from "~/utils/quantityPerCategoryType";

interface MainStatisticsCardProps {
  quantities: {
    ownedQuantity: number;
    likedQuantity: number;
    reviewsQuantity: number;
  };
  bookshelfArray:
    | {
        bookshelf: bookshelfType | null;
      }[];
}

export const MainStatisticsCard: FC<MainStatisticsCardProps> = ({
  quantities,
  bookshelfArray,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categoryArray.map((categoryVariant) => {
        const variantQuantity = quantityPerCategoryType(
          categoryVariant,
          bookshelfArray,
          quantities
        );
        if (categoryVariant === "STATISTICS") return null;

        return (
          <div
            key={categoryVariant}
            className="flex flex-col items-center justify-center gap-0.5"
          >
            <div className="flex h-8 w-8 items-center justify-center">
              {categoryVariant === "OWNED" ? (
                <div className="mb-[-4px]">{getOwnedAsIcon("BOOK", "lg")}</div>
              ) : (
                getBookmarkIcon(categoryVariant, "lg")
              )}
            </div>
            <p className="flex h-8 items-center justify-center text-lg">
              {variantQuantity}
            </p>
          </div>
        );
      })}
    </div>
  );
};
