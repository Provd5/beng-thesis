import { Suspense } from "react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { booksOrderByArray } from "~/types/feed/OrderVariants";
import { BOOKS_FEED_TAKE_LIMIT } from "~/types/feed/TakeLimits";

import { BooksFeed } from "~/components/Feed/BooksFeed";
import { FeedSort } from "~/components/Feed/FeedSort";
import { Pagination } from "~/components/Feed/Pagination";
import { BookCardsLoader } from "~/components/ui/Loaders/Skeletons/BookCardLoader";
import { NotFoundItems } from "~/components/ui/NotFoundItems";
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
  const maxTakeLimit =
    booksCount < BOOKS_FEED_TAKE_LIMIT ? booksCount : BOOKS_FEED_TAKE_LIMIT;

  return (
    <div className="container pb-12">
      {booksCount === 0 ? (
        <NotFoundItems />
      ) : (
        <>
          <FeedSort
            orderArray={booksOrderByArray}
            searchParams={searchParams}
          />

          <div className="grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-2">
            <Suspense fallback={<BookCardsLoader items={maxTakeLimit} />}>
              <BooksFeed
                variant={null}
                fullname={null}
                searchParams={searchParams}
              />
            </Suspense>
          </div>

          <Pagination
            searchParams={searchParams}
            totalItems={booksCount}
            takeLimit={maxTakeLimit}
          />
        </>
      )}
    </div>
  );
}
