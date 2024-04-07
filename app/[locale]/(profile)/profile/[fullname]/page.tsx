import { Suspense } from "react";
import { unstable_setRequestLocale } from "next-intl/server";

import { BookshelvesArray } from "~/types/consts";

import { CategorySection } from "~/components/Bookshelf/CategorySection";
import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";
import { type localeTypes } from "~/i18n";

export default function ProfilePage({
  params: { fullname, locale },
}: {
  params: { fullname: string; locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  return BookshelvesArray.map((bookshelfVariant) => (
    <Suspense key={bookshelfVariant} fallback={<LargeComponentLoader />}>
      <CategorySection
        key={bookshelfVariant}
        bookshelfVariant={bookshelfVariant}
        profileName={fullname}
      />
    </Suspense>
  ));
}
