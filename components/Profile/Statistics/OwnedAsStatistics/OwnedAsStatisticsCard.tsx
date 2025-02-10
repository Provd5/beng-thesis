import type { FC } from "react";

import { getOwnedStatistics } from "~/lib/services/statistics/queries";

import { OwnedAsStatisticsDetails } from "./OwnedAsStatisticsDetails";

interface OwnedAsStatisticsCardProps {
  profileName: string;
}

export const OwnedAsStatisticsCard: FC<OwnedAsStatisticsCardProps> = async ({
  profileName,
}) => {
  const { data: ownedBooks, error } = await getOwnedStatistics(profileName);

  if (error || !ownedBooks) throw new Error(error);

  return <OwnedAsStatisticsDetails ownedBooks={ownedBooks} />;
};
