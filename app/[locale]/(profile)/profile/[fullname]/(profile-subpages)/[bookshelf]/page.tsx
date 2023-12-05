import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { categoryArray, type CategoryTypes } from "~/types/CategoryTypes";
import { bookshelvesOrderByArray } from "~/types/feed/OrderVariants";
import { BOOKS_FEED_TAKE_LIMIT } from "~/types/feed/TakeLimits";

import { BooksFeed } from "~/components/Feed/BooksFeed";
import { FeedSort } from "~/components/Feed/FeedSort";
import { Pagination } from "~/components/Feed/Pagination";
import { BookshelfPageTitle } from "~/components/Profile/Bookshelf/BookshelfPageTitle";
import { BookCardsLoader } from "~/components/ui/Loaders/Skeletons/BookCardLoader";
import { BookReviewCardsLoader } from "~/components/ui/Loaders/Skeletons/BookReviewCardLoader";
import { NotFoundItems } from "~/components/ui/NotFoundItems";
import { type localeTypes } from "~/i18n";
import { fetchBooksInCategoryCount } from "~/lib/actions/feed/books";
import { convertPathnameToTypeEnum } from "~/utils/pathnameTypeEnumConverter";

export async function generateMetadata({
  params: { bookshelf, locale },
}: {
  params: { bookshelf: string; locale: localeTypes };
}) {
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t(bookshelf),
  };
}

export default async function BookshelfPage({
  params: { bookshelf, fullname, locale },
  searchParams,
}: {
  params: { bookshelf: string; fullname: string; locale: localeTypes };
  searchParams?: {
    orderBy?: string;
    order?: "asc" | "desc";
    page?: string;
    q?: string;
  };
}) {
  unstable_setRequestLocale(locale);

  const bookshelfAsType = convertPathnameToTypeEnum(bookshelf) as CategoryTypes;

  if (!categoryArray.includes(bookshelfAsType)) notFound();

  const booksCount = await fetchBooksInCategoryCount(bookshelfAsType, fullname);
  const maxTakeLimit =
    booksCount < BOOKS_FEED_TAKE_LIMIT ? booksCount : BOOKS_FEED_TAKE_LIMIT;

  return (
    <div className="flex flex-col">
      <BookshelfPageTitle
        booksQuantity={booksCount}
        categoryVariant={bookshelfAsType}
      />
      <FeedSort
        orderArray={bookshelvesOrderByArray}
        searchParams={searchParams}
      />
      {!(booksCount > 0) ? (
        <NotFoundItems />
      ) : (
        <>
          {bookshelfAsType === "REVIEWS" ? (
            <div className="grid grid-cols-1 gap-5">
              <Suspense
                fallback={<BookReviewCardsLoader items={maxTakeLimit} />}
              >
                <BooksFeed
                  variant={bookshelfAsType}
                  fullname={fullname}
                  searchParams={searchParams}
                />
              </Suspense>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-2">
              <Suspense fallback={<BookCardsLoader items={maxTakeLimit} />}>
                <BooksFeed
                  variant={bookshelfAsType}
                  fullname={fullname}
                  searchParams={searchParams}
                />
              </Suspense>
            </div>
          )}
        </>
      )}
      <Pagination
        searchParams={searchParams}
        totalItems={booksCount}
        takeLimit={maxTakeLimit}
      />
    </div>
  );
}
