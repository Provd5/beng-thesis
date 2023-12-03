import type { FC } from "react";
import Link from "next/link";

import { MainStatisticsCard } from "./MainStatisticsCard";
import { StatisticsCategoryWrapper } from "./StatisticsCategoryWrapper";

interface StatisticsProps {
  fullname: string;
}

export const Statistics: FC<StatisticsProps> = ({ fullname }) => {
  return (
    <div className="flex justify-center md:justify-start">
      <Link href={`${fullname}/statistics`}>
        <StatisticsCategoryWrapper variant="profile statistics">
          <MainStatisticsCard fullname={fullname} />
        </StatisticsCategoryWrapper>
      </Link>
    </div>
  );
};
