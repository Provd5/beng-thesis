import type { FC } from "react";

import { getReadStatistics } from "~/lib/services/statistics";

import { AlreadyReadStatisticsDetails } from "./AlreadyReadStatisticsDetails";

interface AlreadyReadStatisticsCardProps {
  profileName: string;
}

export const AlreadyReadStatisticsCard: FC<
  AlreadyReadStatisticsCardProps
> = async ({ profileName }) => {
  const readBooks = await getReadStatistics(profileName);

  return <AlreadyReadStatisticsDetails readBooks={readBooks} />;
};
