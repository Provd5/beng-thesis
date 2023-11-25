import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { profilesOrderByArray } from "~/types/feed/OrderVariants";

import { FeedWithSorting } from "~/components/Feed/FeedWithSorting";
import { type localeTypes } from "~/i18n";
import readUserSession from "~/lib/supabase/readUserSession";

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
}: {
  params: { locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  const {
    data: { session },
  } = await readUserSession();

  return (
    <div className="container pb-12">
      <FeedWithSorting
        feedVariant="profiles"
        orderArray={profilesOrderByArray}
        takeLimit={30}
        sessionId={session?.user.id}
        userId={undefined}
        variant={undefined}
      />
    </div>
  );
}
