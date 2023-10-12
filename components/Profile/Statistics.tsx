import type { FC } from "react";
import Link from "next/link";

import { MainStatisticsCard } from "./Statistics/MainStatisticsCard";
import { StatisticsCategoryWrapper } from "./Statistics/StatisticsCategoryWrapper";

interface StatisticsProps {
  userId: string;
  userFullname: string;
}

export const Statistics: FC<StatisticsProps> = ({ userId, userFullname }) => {
  return (
    <div className="flex justify-center">
      <Link href={`/profile/${userFullname}/statistics`}>
        <StatisticsCategoryWrapper variant="profile statistics">
          <MainStatisticsCard userId={userId} />
        </StatisticsCategoryWrapper>
      </Link>
    </div>
  );
};
