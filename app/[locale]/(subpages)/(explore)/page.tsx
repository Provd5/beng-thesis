import { Suspense } from "react";
import { type Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { BooksFeed } from "~/components/Book/BooksFeed";
import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";
import { type localeTypes } from "~/i18n";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: localeTypes };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t("explore"),
  };
}

export default function ExplorePage({
  params: { locale },
  searchParams,
}: {
  params: { locale: localeTypes };
  searchParams: unknown;
}) {
  unstable_setRequestLocale(locale);

  return (
    <div className="container pb-12">
      <Suspense
        key={"ExplorePage-BooksFeed"}
        fallback={<LargeComponentLoader />}
      >
        <BooksFeed searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
