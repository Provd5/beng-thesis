import { notFound } from "next/navigation";

import { AlreadyReadStatisticsCard } from "~/components/Profile/Statistics/AlreadyReadStatistics/AlreadyReadStatisticsCard";
import { MainStatisticsCard } from "~/components/Profile/Statistics/MainStatisticsCard";
import { OwnedAsStatisticsCard } from "~/components/Profile/Statistics/OwnedAsStatistics/OwnedAsStatisticsCard";
import { StatisticsCategoryWrapper } from "~/components/Profile/Statistics/StatisticsCategoryWrapper";
import { db } from "~/lib/db";

export default async function StatisticsPage({
  params: { fullname },
}: {
  params: { fullname: string };
}) {
  const userData = await db.profile.findUnique({
    where: {
      full_name: fullname,
    },
    select: {
      id: true,
    },
  });

  if (!userData) notFound();

  return (
    <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
      {/* all categories statistics */}
      <StatisticsCategoryWrapper variant="profile statistics">
        <MainStatisticsCard userId={userData.id} />
      </StatisticsCategoryWrapper>

      {/* owned category statistics */}
      <StatisticsCategoryWrapper variant="owned books">
        <OwnedAsStatisticsCard userId={userData.id} />
      </StatisticsCategoryWrapper>

      {/* reading category statistics */}
      <StatisticsCategoryWrapper variant="read books">
        <AlreadyReadStatisticsCard userId={userData.id} />
      </StatisticsCategoryWrapper>
    </div>
  );
}
