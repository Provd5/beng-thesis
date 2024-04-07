import { Suspense } from "react";
import { unstable_setRequestLocale } from "next-intl/server";

import { CategoryLink } from "~/components/Links/CategoryLink";
import { AllReviewsButton } from "~/components/Review/AllReviewsButton";
import { MyReview } from "~/components/Review/CreateReview/MyReview";
import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";
import { type localeTypes } from "~/i18n";
import ROUTES from "~/utils/routes";

export default function BookPage({
  params: { id, title, locale },
  searchParams,
}: {
  params: { id: string; title: string; locale: localeTypes };
  searchParams?: string;
}) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <div className="flex flex-col">
        <CategoryLink
          href={{
            pathname: ROUTES.book.reviews(id, title),
            query: searchParams,
          }}
          bookshelfVariant="REVIEWS"
          replace
        />
        <Suspense fallback={<LargeComponentLoader />}>
          <MyReview bookId={id} />
        </Suspense>
      </div>
      <AllReviewsButton
        href={{ pathname: ROUTES.book.reviews(id, title), query: searchParams }}
      />
    </>
  );
}
