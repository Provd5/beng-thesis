import { type FC, Suspense } from "react";
import Link from "next/link";

import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";
import ROUTES from "~/utils/routes";

import { MainStatisticsCard } from "./MainStatistics/MainStatisticsCard";
import { StatisticsCategoryWrapper } from "./StatisticsCategoryWrapper";

interface StatisticsProps {
  profileName: string;
}

export const Statistics: FC<StatisticsProps> = ({ profileName }) => {
  return (
    <div className="flex justify-center md:justify-start">
      <Link href={ROUTES.profile.statistics(profileName)}>
        <StatisticsCategoryWrapper variant="profile statistics">
          <Suspense fallback={<LargeComponentLoader />}>
            <MainStatisticsCard profileName={profileName} />
          </Suspense>
        </StatisticsCategoryWrapper>
      </Link>
    </div>
  );
};
