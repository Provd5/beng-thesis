import { unstable_setRequestLocale } from "next-intl/server";

import { categoryArray } from "~/types/CategoryTypes";

import { CategorySection } from "~/components/Profile/CategorySection";
import { type localeTypes } from "~/i18n";

export default function ProfilePage({
  params: { fullname, locale },
}: {
  params: { fullname: string; locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  return categoryArray.map((categoryVariant) => (
    <CategorySection
      key={categoryVariant}
      categoryVariant={categoryVariant}
      fullname={fullname}
    />
  ));
}
