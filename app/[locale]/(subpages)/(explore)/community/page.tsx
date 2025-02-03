import { Suspense } from "react";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ProfilesFeed } from "~/components/Profile/ProfilesFeed";
import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";
import { type localeTypes } from "~/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: { locale: localeTypes };
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t("community"),
  };
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: unknown;
}) {
  const awaitedSearchParams = await searchParams;

  return (
    <div className="container pb-12">
      <Suspense
        key={"CommunityPage-ProfilesFeed"}
        fallback={<LargeComponentLoader />}
      >
        <ProfilesFeed searchParams={awaitedSearchParams} />
      </Suspense>
    </div>
  );
}
