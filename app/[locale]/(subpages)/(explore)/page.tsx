import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { BooksFeed } from "~/components/Feed/BooksFeed";
import { type localeTypes } from "~/i18n";
import { fetchBooksInCategoryCount } from "~/lib/actions/feed/books";

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
  const booksCount = await fetchBooksInCategoryCount(null, null);

  return (
    <div className="container pb-12">
      <BooksFeed
        variant={null}
        fullname={null}
        searchParams={searchParams}
        booksCount={booksCount}
      />
    </div>
  );
}
