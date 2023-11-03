import type { FC } from "react";

import { categoryArray } from "~/types/CategoryTypes";

import { getBookmarkIcon } from "~/components/ui/getBookmarkIcon";
import { getOwnedAsIcon } from "~/components/ui/getOwnedAsIcon";
import { db } from "~/lib/db";
import { quantityPerCategoryType } from "~/utils/quantityPerCategoryType";

interface MainStatisticsCardProps {
  userId: string;
}

export const MainStatisticsCard: FC<MainStatisticsCardProps> = async ({
  userId,
}) => {
  const CategoryQuantityData = await db.profile.findUnique({
    where: {
      id: userId,
    },
    select: {
      _count: {
        select: {
          book_owned_as: {
            where: {
              NOT: {
                AND: [
                  { added_audiobook_at: null },
                  { added_book_at: null },
                  { added_ebook_at: null },
                ],
              },
            },
          },
          liked_book: true,
          review: true,
        },
      },
      bookshelf: { select: { bookshelf: true } },
    },
  });

  const quantities = {
    ownedQuantity: CategoryQuantityData?._count.book_owned_as,
    likedQuantity: CategoryQuantityData?._count.liked_book,
    reviewsQuantity: CategoryQuantityData?._count.review,
  };

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categoryArray.map((categoryVariant) => {
        const variantQuantity = quantityPerCategoryType(
          categoryVariant,
          CategoryQuantityData?.bookshelf || [],
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
