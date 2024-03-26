import { Suspense } from "react";
import { unstable_setRequestLocale } from "next-intl/server";

import { CategoriesArray } from "~/types/consts";

import { CategorySection } from "~/components/Bookshelf/CategorySection";
import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";
import { type localeTypes } from "~/i18n";

export default function ProfilePage({
  params: { fullname, locale },
}: {
  params: { fullname: string; locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  return CategoriesArray.map((categoryVariant) => (
    <Suspense key={categoryVariant} fallback={<LargeComponentLoader />}>
      <CategorySection
        key={categoryVariant}
        categoryVariant={categoryVariant}
        profileName={fullname}
      />
    </Suspense>
  ));
}
