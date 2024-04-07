import { Suspense } from "react";
import { notFound, type ReadonlyURLSearchParams } from "next/navigation";
import { type Formats, type TranslationValues } from "next-intl";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { BookshelvesArray, type BookshelvesTypes } from "~/types/consts";

import { BookshelfFeed } from "~/components/Bookshelf/BookshelfFeed";
import { ReviewBookshelfFeed } from "~/components/Bookshelf/ReviewBookshelfFeed";
import { BackCategoryLink } from "~/components/Links/BackCategoryLink";
import { CategoryLinksContainer } from "~/components/Links/CategoryLinksContainer";
import { DragContainer } from "~/components/ui/DragContainer";
import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";
import { type localeTypes } from "~/i18n";
import { convertPathnameToTypeEnum } from "~/utils/pathnameTypeEnumConverter";
import ROUTES from "~/utils/routes";

export async function generateMetadata({
  params: { bookshelf, locale },
}: {
  params: { bookshelf: string; locale: localeTypes };
}) {
  const t = (await getTranslations({
    locale,
    namespace: "Nav.CategoryTitles",
  })) as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined
  ) => string;
  return {
    title: t(bookshelf),
  };
}

export default function BookshelfPage({
  params: { bookshelf, fullname, locale },
  searchParams,
}: {
  params: { bookshelf: string; fullname: string; locale: localeTypes };
  searchParams: ReadonlyURLSearchParams;
}) {
  unstable_setRequestLocale(locale);

  const validBookshelf = convertPathnameToTypeEnum(
    bookshelf
  ) as BookshelvesTypes;

  if (!BookshelvesArray.includes(validBookshelf)) notFound();

  return (
    <>
      <BackCategoryLink variant="RETURN" href={ROUTES.profile.back(fullname)} />
      <DragContainer
        arrowSize="sm"
        containerClassName="flex-start py-1 px-0.5 hidden-scrollbar gap-1"
      >
        <CategoryLinksContainer profileName={fullname} />
      </DragContainer>
      <div className="flex flex-col">
        {validBookshelf === "REVIEWS" ? (
          <Suspense fallback={<LargeComponentLoader />}>
            <ReviewBookshelfFeed
              profileName={fullname}
              searchParams={searchParams}
            />
          </Suspense>
        ) : (
          <Suspense fallback={<LargeComponentLoader />}>
            <BookshelfFeed
              profileName={fullname}
              bookshelf={validBookshelf}
              searchParams={searchParams}
            />
          </Suspense>
        )}
      </div>
    </>
  );
}
