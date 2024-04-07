import { Suspense } from "react";
import { type ReadonlyURLSearchParams } from "next/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { ProfilesFeed } from "~/components/Profile/ProfilesFeed";
import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";
import { type localeTypes } from "~/i18n";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t("community"),
  };
}

export default function CommunityPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: localeTypes };
  searchParams: ReadonlyURLSearchParams;
}) {
  unstable_setRequestLocale(locale);

  return (
    <div className="container pb-12">
      <Suspense fallback={<LargeComponentLoader />}>
        <ProfilesFeed searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
