import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { AlreadyReadStatisticsCard } from "~/components/Profile/Statistics/AlreadyReadStatistics/AlreadyReadStatisticsCard";
import { MainStatisticsCard } from "~/components/Profile/Statistics/MainStatisticsCard";
import { OwnedAsStatisticsCard } from "~/components/Profile/Statistics/OwnedAsStatistics/OwnedAsStatisticsCard";
import { StatisticsCategoryWrapper } from "~/components/Profile/Statistics/StatisticsCategoryWrapper";
import { type localeTypes } from "~/i18n";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t("statistics"),
  };
}

export default function StatisticsPage({
  params: { fullname, locale },
}: {
  params: { fullname: string; locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  return (
    <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
      {/* all categories statistics */}
      <StatisticsCategoryWrapper variant="profile statistics">
        <MainStatisticsCard fullname={fullname} />
      </StatisticsCategoryWrapper>

      {/* owned statistics */}
      <StatisticsCategoryWrapper variant="owned books">
        <OwnedAsStatisticsCard fullname={fullname} />
      </StatisticsCategoryWrapper>

      {/* reading statistics */}
      <StatisticsCategoryWrapper variant="read books">
        <AlreadyReadStatisticsCard fullname={fullname} />
      </StatisticsCategoryWrapper>
    </div>
  );
}
