import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { SearchComponent } from "~/components/Search/SearchComponent";
import { SearchFeed } from "~/components/Search/SearchFeed";
import { type localeTypes } from "~/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: { locale: localeTypes };
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t("search"),
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: unknown;
}) {
  const awaitedSearchParams = await searchParams;

  return (
    <>
      <SearchComponent searchParams={awaitedSearchParams}>
        <div className="container pb-12">
          <SearchFeed searchParams={awaitedSearchParams} />
        </div>
      </SearchComponent>
    </>
  );
}
