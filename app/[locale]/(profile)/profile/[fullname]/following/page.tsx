import { Suspense } from "react";
import { type Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { FollowPage } from "~/components/Profile/Follows/FollowPage";
import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";
import { type localeTypes } from "~/i18n";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: localeTypes };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t("following"),
  };
}

export default function FollowingPage({
  params: { fullname, locale },
  searchParams,
}: {
  params: { fullname: string; locale: localeTypes };
  searchParams: unknown;
}) {
  unstable_setRequestLocale(locale);

  return (
    <Suspense key={"following"} fallback={<LargeComponentLoader />}>
      <FollowPage
        searchParams={searchParams}
        profileName={fullname}
        variant="following"
      />
    </Suspense>
  );
}
