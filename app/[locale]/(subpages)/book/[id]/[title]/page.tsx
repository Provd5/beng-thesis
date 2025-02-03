import { Suspense } from "react";

import { CategoryLink } from "~/components/Links/CategoryLink";
import { AllReviewsButton } from "~/components/Review/AllReviewsButton";
import { MyReview } from "~/components/Review/CreateReview/MyReview";
import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";
import ROUTES from "~/utils/routes";

export default async function BookPage({
  params,
  searchParams,
}: {
  params: { id: string; title: string };
  searchParams?: string;
}) {
  const { id, title } = await params;
  const awaitedSearchParams = await searchParams;

  return (
    <>
      <div className="flex flex-col">
        <CategoryLink
          href={{
            pathname: ROUTES.book.reviews(id, title),
            query: awaitedSearchParams,
          }}
          bookshelfVariant="REVIEWS"
          replace
        />
        <Suspense key={"MyReview"} fallback={<LargeComponentLoader />}>
          <MyReview bookId={id} />
        </Suspense>
      </div>
      <AllReviewsButton
        href={{
          pathname: ROUTES.book.reviews(id, title),
          query: awaitedSearchParams,
        }}
      />
    </>
  );
}
