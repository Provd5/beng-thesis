import { Suspense } from "react";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { FollowPage } from "~/components/Profile/Follows/FollowPage";
import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";
import { type localeTypes } from "~/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: localeTypes }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t("following"),
  };
}

export default async function FollowingPage({
  params,
  searchParams,
}: {
  params: Promise<{ fullname: string }>;
  searchParams: Promise<unknown> | undefined;
}) {
  const { fullname } = await params;
  const awaitedSearchParams = await searchParams;

  return (
    <Suspense key={"following"} fallback={<LargeComponentLoader />}>
      <FollowPage
        searchParams={awaitedSearchParams}
        profileName={fullname}
        variant="following"
      />
    </Suspense>
  );
}
