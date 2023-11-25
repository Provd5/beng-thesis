import { Suspense } from "react";
import { cookies } from "next/headers";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { SearchComponent } from "~/components/Search/SearchComponent";
import { type localeTypes } from "~/i18n";

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

  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <Suspense fallback={<Loading />}>
      <SearchComponent sessionId={session?.user.id} />
    </Suspense>
  );
}
