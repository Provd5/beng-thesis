import type { FC } from "react";

import { ownedAsArray } from "~/types/CategoryTypes";

import { getOwnedAsIcon } from "~/components/ui/getOwnedAsIcon";
import { quantityPerOwnedType } from "~/utils/quantityPerOwnedType";

import { OwnedAsStatisticsLabels } from "./OwnedAsStatisticsLabels";

interface OwnedAsStatisticsCardProps {
  booksOwnedArray: {
    added_audiobook_at: Date | null;
    added_book_at: Date | null;
    added_ebook_at: Date | null;
  }[];
}

export const OwnedAsStatisticsCard: FC<OwnedAsStatisticsCardProps> = ({
  booksOwnedArray,
}) => {
  const totalBooksQuantity =
    quantityPerOwnedType("BOOK", booksOwnedArray) +
    quantityPerOwnedType("EBOOK", booksOwnedArray) +
    quantityPerOwnedType("AUDIOBOOK", booksOwnedArray);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-3">
        {ownedAsArray.map((ownedAs) => (
          <div
            key={ownedAs}
            className="flex flex-col items-center justify-center gap-0.5"
          >
            {getOwnedAsIcon(ownedAs)}
            <p className="text-md">
              {quantityPerOwnedType(ownedAs, booksOwnedArray)}
            </p>
          </div>
        ))}
      </div>
      <OwnedAsStatisticsLabels
        uniqueBooksQuantity={booksOwnedArray.length || 0}
        totalBooksQuantity={totalBooksQuantity}
      />
    </div>
  );
};
