import type { FC } from "react";

import { type BookshelvesTypes } from "~/types/consts";

import { BookmarkIcon } from "~/components/ui/Icons/BookmarkIcon";
import { OwnedBookIcon } from "~/components/ui/Icons/OwnedBookIcon";

interface MainStatisticsLabelProps {
  label: BookshelvesTypes;
  value: number;
}

export const MainStatisticsLabel: FC<MainStatisticsLabelProps> = ({
  label,
  value,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-0.5">
      <div className="flex size-8 items-center justify-center">
        {label === "OWNED" ? (
          <div className="mb-[-4px]">
            <OwnedBookIcon ownedAs="BOOK" size="lg" />
          </div>
        ) : (
          <BookmarkIcon category={label} size="lg" />
        )}
      </div>
      <p className="flex h-8 items-center justify-center text-lg">{value}</p>
    </div>
  );
};
