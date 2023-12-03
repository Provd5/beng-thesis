import type { FC } from "react";

import { type OwnedAsType } from "~/types/CategoryTypes";

import { getOwnedAsIcon } from "~/components/ui/getOwnedAsIcon";
import { fetchOwnedAsStatistics } from "~/lib/actions/profile/statistics";

import { OwnedAsStatisticsLabels } from "./OwnedAsStatisticsLabels";

interface OwnedAsStatisticsCardProps {
  fullname: string;
}

export const OwnedAsStatisticsCard: FC<OwnedAsStatisticsCardProps> = async ({
  fullname,
}) => {
  const { counts, uniqueCounts, totalCounts } = await fetchOwnedAsStatistics(
    fullname
  );

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-3">
        {counts.map((ownedAs) => {
          const label = Object.keys(ownedAs)[0] as OwnedAsType;
          const value = ownedAs[label];

          return (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-0.5"
            >
              {getOwnedAsIcon(label)}
              <p className="text-md">{value}</p>
            </div>
          );
        })}
      </div>
      <OwnedAsStatisticsLabels
        uniqueBooksQuantity={uniqueCounts}
        totalBooksQuantity={totalCounts}
      />
    </div>
  );
};
