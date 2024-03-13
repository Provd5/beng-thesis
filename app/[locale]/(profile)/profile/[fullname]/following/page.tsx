import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { FollowPage } from "~/components/Profile/FollowPage";
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
  searchParams?: {
    orderBy?: string;
    order?: "asc" | "desc";
    page?: string;
  };
}) {
  unstable_setRequestLocale(locale);

  return (
    <FollowPage
      searchParams={searchParams}
      fullname={fullname}
      variant="following"
    />
  );
}
