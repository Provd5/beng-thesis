import type { FC } from "react";

import { getReadStatistics } from "~/lib/services/statistics/queries";

import { AlreadyReadStatisticsDetails } from "./AlreadyReadStatisticsDetails";

interface AlreadyReadStatisticsCardProps {
  profileName: string;
}

export const AlreadyReadStatisticsCard: FC<
  AlreadyReadStatisticsCardProps
> = async ({ profileName }) => {
  const { data: readBooks, error } = await getReadStatistics(profileName);

  if (error || !readBooks) throw new Error(error);

  return <AlreadyReadStatisticsDetails readBooks={readBooks} />;
};
