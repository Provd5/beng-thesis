import { Suspense } from "react";
import { type ReadonlyURLSearchParams } from "next/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { FollowPage } from "~/components/Profile/Follows/FollowPage";
import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";
import { type localeTypes } from "~/i18n";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
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
  searchParams: ReadonlyURLSearchParams;
}) {
  unstable_setRequestLocale(locale);

  return (
    <Suspense fallback={<LargeComponentLoader />}>
      <FollowPage
        searchParams={searchParams}
        profileName={fullname}
        variant="following"
      />
    </Suspense>
  );
}
