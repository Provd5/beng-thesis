import type { FC } from "react";

import { BookshelvesArray } from "~/types/categoryArrays";
import { type BookshelvesTypes } from "~/types/data/bookshelf";

import { BookmarkIcon } from "~/components/ui/Icons/BookmarkIcon";
import { OwnedBookIcon } from "~/components/ui/Icons/OwnedBookIcon";
import { BookshelfService } from "~/lib/services/bookshelf";

interface MainStatisticsCardProps {
  profileName: string;
}

export const MainStatisticsCard: FC<MainStatisticsCardProps> = async ({
  profileName,
}) => {
  const bookshelfService = new BookshelfService();

  const quantities = await Promise.all(
    BookshelvesArray.map(async (bookshelfVariant) => ({
      [bookshelfVariant]: await bookshelfService.getQuantity(
        profileName,
        bookshelfVariant
      ),
    }))
  );

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {quantities.map((bookshelfVariant) => {
        const label = Object.keys(bookshelfVariant)[0] as BookshelvesTypes;
        const value = bookshelfVariant[label];

        return (
          <div
            key={label}
            className="flex flex-col items-center justify-center gap-0.5"
          >
            <div className="flex h-8 w-8 items-center justify-center">
              {label === "OWNED" ? (
                <div className="mb-[-4px]">
                  <OwnedBookIcon ownedAs="BOOK" size="lg" />
                </div>
              ) : (
                <BookmarkIcon category={label} size="lg" />
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
