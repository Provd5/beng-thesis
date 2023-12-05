import { Suspense } from "react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { EmptyQuery } from "~/components/Search/EmptyQuery";
import { SearchComponent } from "~/components/Search/SearchComponent";
import { SearchFeed } from "~/components/Search/SearchFeed";
import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";
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

export default function SearchPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: localeTypes };
  searchParams?: {
    orderBy?: string;
    order?: "asc" | "desc";
    page?: string;
    q?: string;
    category?: "books" | "profiles";
  };
}) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <SearchComponent searchParams={searchParams} />
      </Suspense>
      <div className="container pb-12">
        <Suspense fallback={<LargeComponentLoader />}>
          {!searchParams?.q ? (
            <EmptyQuery />
          ) : (
            <SearchFeed searchParams={searchParams} />
          )}
        </Suspense>
      </div>
    </>
  );
}
