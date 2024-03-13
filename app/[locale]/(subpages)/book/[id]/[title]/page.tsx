import { notFound } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";
import { z } from "zod";

import { AllReviewsButton } from "~/components/Book/AllReviewsButton";
import { MyReview } from "~/components/Book/MyReview";
import { CategoryLink } from "~/components/ui/CategoryLink";
import { type localeTypes } from "~/i18n";
import { fetchMyReview, fetchReviewReactions } from "~/lib/actions/book/fetch";

export default async function BookPage({
  params: { id, title, locale },
  searchParams,
}: {
  params: { id: string; title: string; locale: localeTypes };
  searchParams?: string;
}) {
  unstable_setRequestLocale(locale);

  try {
    z.string().uuid().parse(id);
  } catch (error) {
    notFound();
  }

  const myReview = await fetchMyReview(id);
  const reviewReactions = await fetchReviewReactions(myReview?.id);

  return (
    <>
      <div className="flex flex-col">
        <CategoryLink
          href={{ pathname: `${title}/reviews`, query: searchParams }}
          variant="REVIEWS"
          hrefReplace
        />
        <MyReview
          reviewData={myReview}
          reviewReactions={reviewReactions}
          bookId={id}
        />
      </div>
      {myReview !== undefined && (
        <AllReviewsButton
          href={{ pathname: `${title}/reviews`, query: searchParams }}
        />
      )}
    </>
  );
}
