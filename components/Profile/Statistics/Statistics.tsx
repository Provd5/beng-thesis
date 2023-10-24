import type { FC } from "react";
import Link from "next/link";

import { MainStatisticsCard } from "./MainStatisticsCard";
import { StatisticsCategoryWrapper } from "./StatisticsCategoryWrapper";

interface StatisticsProps {
  userId: string;
  userFullname: string;
}

export const Statistics: FC<StatisticsProps> = ({ userId, userFullname }) => {
  return (
    <div className="flex justify-center md:justify-start">
      <Link href={`${userFullname}/statistics`}>
        <StatisticsCategoryWrapper variant="profile statistics">
          <MainStatisticsCard userId={userId} />
        </StatisticsCategoryWrapper>
      </Link>
    </div>
  );
};
