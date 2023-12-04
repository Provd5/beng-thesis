import { Suspense } from "react";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";
import { z } from "zod";

import { reviewsOrderByArray } from "~/types/feed/OrderVariants";
import { REVIEWS_FEED_TAKE_LIMIT } from "~/types/feed/TakeLimits";

import { FeedSort } from "~/components/Feed/FeedSort";
import { Pagination } from "~/components/Feed/Pagination";
import { ReviewsFeed } from "~/components/Feed/ReviewsFeed";
import { BackCategoryLink } from "~/components/ui/BackCategoryLink";
import { BookReviewCardsLoader } from "~/components/ui/Loaders/Skeletons/BookReviewCardLoader";
import { NotFoundItems } from "~/components/ui/NotFoundItems";
import { type localeTypes } from "~/i18n";
import { fetchReviewsCount } from "~/lib/actions/feed/reviews";

export default async function BookReviewsPage({
  params: { id, title, locale },
  searchParams,
}: {
  params: { id: string; title: string; locale: localeTypes };
  searchParams?: {
    orderBy?: string;
    order?: "asc" | "desc";
    page?: string;
    from?: string;
  };
}) {
  unstable_setRequestLocale(locale);

  try {
    z.string().uuid().parse(id);
  } catch (error) {
    notFound();
  }

  const reviewsCount = await fetchReviewsCount(id);
  const maxTakeLimit =
    reviewsCount < REVIEWS_FEED_TAKE_LIMIT
      ? reviewsCount
      : REVIEWS_FEED_TAKE_LIMIT;

  return (
    <div className="flex flex-col">
      <BackCategoryLink
        href={{ pathname: `../${title}`, query: searchParams }}
        variant="MY_REVIEW"
        hrefReplace
      />
      <FeedSort orderArray={reviewsOrderByArray} searchParams={searchParams} />
      {!(reviewsCount > 0) ? (
        <NotFoundItems itemType="reviews" />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          <Suspense fallback={<BookReviewCardsLoader items={maxTakeLimit} />}>
            <ReviewsFeed bookId={id} searchParams={searchParams} />
          </Suspense>
        </div>
      )}
      <Pagination
        searchParams={searchParams}
        totalItems={reviewsCount}
        takeLimit={maxTakeLimit}
      />
    </div>
  );
}
