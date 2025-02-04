import type { FC } from "react";

import { getOwnedStatistics } from "~/lib/services/statistics/queries";

import { OwnedAsStatisticsDetails } from "./OwnedAsStatisticsDetails";

interface OwnedAsStatisticsCardProps {
  profileName: string;
}

export const OwnedAsStatisticsCard: FC<OwnedAsStatisticsCardProps> = async ({
  profileName,
}) => {
  const ownedBooks = await getOwnedStatistics(profileName);

  return <OwnedAsStatisticsDetails ownedBooks={ownedBooks} />;
};
