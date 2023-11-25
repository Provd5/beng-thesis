import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { booksOrderByArray } from "~/types/feed/OrderVariants";

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
    title: t("explore"),
  };
}

export default async function ExplorePage({
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
        feedVariant="books"
        orderArray={booksOrderByArray}
        takeLimit={20}
        sessionId={session?.user.id}
        profileName={undefined}
        variant={undefined}
      />
    </div>
  );
}
