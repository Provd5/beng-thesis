import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { booksOrderByArray } from "~/types/feed/OrderVariants";
import { BOOKS_FEED_TAKE_LIMIT } from "~/types/feed/TakeLimits";

import { BookCard } from "~/components/Explore/BookCard";
import { FeedSort } from "~/components/Feed/FeedSort";
import { Pagination } from "~/components/Feed/Pagination";
import { NotFoundItems } from "~/components/ui/NotFoundItems";
import { type localeTypes } from "~/i18n";
import { fetchBooks } from "~/lib/actions/feed/books";
import { fetchBooksCount } from "~/lib/actions/feed/booksCount";
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

  const [books, booksCount] = await Promise.all([
    fetchBooks(null, null, searchParams),
    fetchBooksCount(null, null),
  ]);

  const {
    data: { session },
  } = await readUserSession();

  return (
    <div className="container pb-12">
      <FeedSort orderArray={booksOrderByArray} searchParams={searchParams} />
      {!(books.length > 0) ? (
        <NotFoundItems />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-2">
            {(books as BookInterface[]).map((book) => (
              <BookCard
                key={book.id}
                bookData={book}
                sessionId={session?.user.id}
              />
            ))}
          </div>
        </>
      )}
      <Pagination
        searchParams={searchParams}
        totalItems={booksCount}
        takeLimit={BOOKS_FEED_TAKE_LIMIT}
      />
    </div>
  );
}
