import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { SearchFeed } from "~/components/Feed/SearchFeed";
import { SearchComponent } from "~/components/Search/SearchComponent";
import { type localeTypes } from "~/i18n";

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
      <SearchComponent searchParams={searchParams} />
      <div className="container pb-12">
        <SearchFeed searchParams={searchParams} />
      </div>
    </>
  );
}
