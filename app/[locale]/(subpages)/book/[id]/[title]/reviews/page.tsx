import { notFound } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";
import { z } from "zod";

import { ReviewsFeed } from "~/components/Feed/ReviewsFeed";
import { BackCategoryLink } from "~/components/ui/BackCategoryLink";
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

  return (
    <div className="flex flex-col">
      <BackCategoryLink
        href={{ pathname: `../${title}`, query: searchParams }}
        variant="MY_REVIEW"
        hrefReplace
      />
      <ReviewsFeed
        bookId={id}
        searchParams={searchParams}
        reviewsCount={reviewsCount}
      />
    </div>
  );
}
