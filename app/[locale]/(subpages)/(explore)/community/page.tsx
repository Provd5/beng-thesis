import { Suspense } from "react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { profilesOrderByArray } from "~/types/feed/OrderVariants";
import { PROFILES_FEED_TAKE_LIMIT } from "~/types/feed/TakeLimits";

import { FeedSort } from "~/components/Feed/FeedSort";
import { Pagination } from "~/components/Feed/Pagination";
import { ProfilesFeed } from "~/components/Feed/ProfilesFeed";
import { ProfileCardsLoader } from "~/components/ui/Loaders/Skeletons/ProfileCardLoader";
import { NotFoundItems } from "~/components/ui/NotFoundItems";
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
  const maxTakeLimit =
    profilesCount < PROFILES_FEED_TAKE_LIMIT
      ? profilesCount
      : PROFILES_FEED_TAKE_LIMIT;

  return (
    <div className="container pb-12">
      {profilesCount === 0 ? (
        <NotFoundItems />
      ) : (
        <>
          <FeedSort
            orderArray={profilesOrderByArray}
            searchParams={searchParams}
          />
          <div className="grid grid-cols-1 justify-items-center gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <Suspense fallback={<ProfileCardsLoader items={maxTakeLimit} />}>
              <ProfilesFeed
                variant={null}
                fullname={null}
                searchParams={searchParams}
              />
            </Suspense>
          </div>
          <Pagination
            searchParams={searchParams}
            totalItems={profilesCount}
            takeLimit={maxTakeLimit}
          />
        </>
      )}
    </div>
  );
}
