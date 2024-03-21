import type { FC } from "react";
import Link from "next/link";

import ROUTES from "~/utils/routes";

import { MainStatisticsCard } from "./MainStatisticsCard";
import { StatisticsCategoryWrapper } from "./StatisticsCategoryWrapper";

interface StatisticsProps {
  profileName: string;
}

export const Statistics: FC<StatisticsProps> = ({ profileName }) => {
  return (
    <div className="flex justify-center md:justify-start">
      <Link href={ROUTES.profile.bookshelf("STATISTICS")}>
        <StatisticsCategoryWrapper variant="profile statistics">
          <MainStatisticsCard profileName={profileName} />
        </StatisticsCategoryWrapper>
      </Link>
    </div>
  );
};
