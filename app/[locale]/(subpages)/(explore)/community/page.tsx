import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { ProfilesFeed } from "~/components/Feed/ProfilesFeed";
import { type localeTypes } from "~/i18n";
import { fetchProfilesCount } from "~/lib/actions/feed/profiles";

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

export default async function CommunityPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: localeTypes };
  searchParams?: {
    orderBy?: string;
    order?: "asc" | "desc";
    page?: string;
  };
}) {
  unstable_setRequestLocale(locale);

  const profilesCount = await fetchProfilesCount(null, null);

  return (
    <div className="container pb-12">
      <ProfilesFeed
        variant={null}
        fullname={null}
        searchParams={searchParams}
        profilesCount={profilesCount}
      />
    </div>
  );
}
