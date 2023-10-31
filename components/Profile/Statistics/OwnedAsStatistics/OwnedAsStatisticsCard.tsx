import type { FC } from "react";

import { ownedAsArray } from "~/types/CategoryTypes";

import { getOwnedAsIcon } from "~/components/ui/getOwnedAsIcon";
import { db } from "~/lib/db";
import { quantityPerOwnedType } from "~/utils/quantityPerOwnedType";

import { OwnedAsStatisticsLabels } from "./OwnedAsStatisticsLabels";

interface OwnedAsStatisticsCardProps {
  userId: string;
}

export const OwnedAsStatisticsCard: FC<OwnedAsStatisticsCardProps> = async ({
  userId,
}) => {
  const bookOwnedAsData = await db.profile.findUnique({
    where: { id: userId },
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
        select: {
          added_audiobook_at: true,
          added_book_at: true,
          added_ebook_at: true,
        },
      },
    },
  });

  const totalBooksQuantity =
    quantityPerOwnedType("BOOK", bookOwnedAsData?.book_owned_as) +
    quantityPerOwnedType("EBOOK", bookOwnedAsData?.book_owned_as) +
    quantityPerOwnedType("AUDIOBOOK", bookOwnedAsData?.book_owned_as);

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
              {quantityPerOwnedType(ownedAs, bookOwnedAsData?.book_owned_as)}
            </p>
          </div>
        ))}
      </div>
      <OwnedAsStatisticsLabels
        uniqueBooksQuantity={bookOwnedAsData?.book_owned_as.length || 0}
        totalBooksQuantity={totalBooksQuantity}
      />
    </div>
  );
};
