import { Suspense } from "react";
import { unstable_setRequestLocale } from "next-intl/server";

import { ReviewsFeed } from "~/components/Review/ReviewsFeed";
import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";
import { type localeTypes } from "~/i18n";

export default function BookReviewsPage({
  params: { id, title, locale },
  searchParams,
}: {
  params: { id: string; title: string; locale: localeTypes };
  searchParams: unknown;
}) {
  unstable_setRequestLocale(locale);

  return (
    <div className="flex flex-col">
      <Suspense
        key={"BookReviewsPage-ReviewsFeed"}
        fallback={<LargeComponentLoader />}
      >
        <ReviewsFeed
          bookId={id}
          bookTitle={title}
          searchParams={searchParams}
        />
      </Suspense>
    </div>
  );
}
