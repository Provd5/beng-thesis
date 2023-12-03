import { unstable_setRequestLocale } from "next-intl/server";

import { categoryArray } from "~/types/CategoryTypes";

import { CategoryContentCard } from "~/components/Profile/CategoryContentCard";
import { CategoryContentCardPlaceholder } from "~/components/Profile/CategoryContentCardPlaceholder";
import { Statistics } from "~/components/Profile/Statistics/Statistics";
import { CategoryLink } from "~/components/ui/CategoryLink";
import { DragContainer } from "~/components/ui/DragContainer";
import { type localeTypes } from "~/i18n";
import { fetchCategoryCount } from "~/lib/actions/profile/fetch";
import { convertTypeEnumToPathname } from "~/utils/pathnameTypeEnumConverter";

export default function ProfilePage({
  params: { fullname, locale },
}: {
  params: { fullname: string; locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  return categoryArray.map(async (categoryVariant) => {
    const variantUrl = `${fullname}/${convertTypeEnumToPathname(
      categoryVariant
    )}`;
    const variantQuantity = await fetchCategoryCount(fullname, categoryVariant);

    return (
      <div key={categoryVariant} className="flex flex-col gap-1">
        {categoryVariant === "STATISTICS" ? (
          <>
            <CategoryLink
              variant="STATISTICS"
              href={`${fullname}/statistics`}
            />
            <Statistics fullname={fullname} />
          </>
        ) : (
          <>
            <CategoryLink
              variant={categoryVariant}
              href={variantUrl}
              quantity={variantQuantity}
            />
            <DragContainer
              arrowsClassName="mb-6"
              containerClassName="custom-scrollbar flex snap-x scroll-px-3 gap-3 px-3 pb-2 pt-0.5"
            >
              {variantQuantity > 0 ? (
                <>
                  <CategoryContentCard
                    variant={categoryVariant}
                    profileName={fullname}
                    dataLength={variantQuantity}
                  />
                  {variantQuantity > 10 && (
                    <CategoryContentCardPlaceholder href={variantUrl} />
                  )}
                </>
              ) : (
                <CategoryContentCardPlaceholder href="/" isEmpty />
              )}
            </DragContainer>
          </>
        )}
      </div>
    );
  });
}
