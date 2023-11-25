import { Suspense } from "react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { SearchComponent } from "~/components/Search/SearchComponent";
import { type localeTypes } from "~/i18n";
import readUserSession from "~/lib/supabase/readUserSession";

import Loading from "./loading";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t("search"),
  };
}

export default async function SearchPage({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  const {
    data: { session },
  } = await readUserSession();

  return (
    <Suspense fallback={<Loading />}>
      <SearchComponent sessionId={session?.user.id} />
    </Suspense>
  );
}
