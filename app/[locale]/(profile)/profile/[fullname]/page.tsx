import { Suspense } from "react";
import { type Formats, type TranslationValues } from "next-intl";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { BookshelvesArray, type BookshelvesTypes } from "~/types/consts";

import { BookshelfFeed } from "~/components/Bookshelf/BookshelfFeed";
import { ReviewBookshelfFeed } from "~/components/Bookshelf/ReviewBookshelfFeed";
import { CategoryLinksContainer } from "~/components/Links/CategoryLinksContainer";
import { DragContainer } from "~/components/ui/DragContainer";
import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";
import { type localeTypes } from "~/i18n";
import {
  convertPathnameToTypeEnum,
  convertTypeEnumToPathname,
} from "~/utils/pathnameTypeEnumConverter";

export async function generateMetadata({
  params: { fullname, locale },
  searchParams,
}: {
  params: { fullname: string; locale: localeTypes };
  searchParams: { bookshelf?: string };
}) {
  const t = (await getTranslations({
    locale,
    namespace: "Nav.CategoryTitles",
  })) as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined
  ) => string;
  const bookshelfAsEnum = searchParams.bookshelf
    ? (convertPathnameToTypeEnum(searchParams.bookshelf) as BookshelvesTypes)
    : "ALREADY_READ";
  const validBookshelf: BookshelvesTypes = BookshelvesArray.includes(
    bookshelfAsEnum
  )
    ? bookshelfAsEnum
    : "ALREADY_READ";

  return {
    title: `@${decodeURIComponent(fullname)}/${t(
      convertTypeEnumToPathname(validBookshelf)
    )}`,
  };
}

export default function BookshelfPage({
  params: { fullname, locale },
  searchParams,
}: {
  params: { fullname: string; locale: localeTypes };
  searchParams: { bookshelf?: string };
}) {
  unstable_setRequestLocale(locale);

  const bookshelfAsEnum = searchParams.bookshelf
    ? (convertPathnameToTypeEnum(searchParams.bookshelf) as BookshelvesTypes)
    : "ALREADY_READ";
  const validBookshelf: BookshelvesTypes = BookshelvesArray.includes(
    bookshelfAsEnum
  )
    ? bookshelfAsEnum
    : "ALREADY_READ";

  return (
    <>
      {/* <BackCategoryLink variant="RETURN" href={ROUTES.profile.back(fullname)} /> */}
      <DragContainer
        arrowSize="sm"
        containerClassName="flex-start py-1 px-0.5 hidden-scrollbar gap-1"
      >
        <CategoryLinksContainer
          profileName={fullname}
          currentBookshelf={validBookshelf}
        />
      </DragContainer>
      <div className="flex flex-col">
        {validBookshelf === "REVIEWS" ? (
          <Suspense key={validBookshelf} fallback={<LargeComponentLoader />}>
            <ReviewBookshelfFeed
              profileName={fullname}
              searchParams={searchParams}
            />
          </Suspense>
        ) : (
          <Suspense key={validBookshelf} fallback={<LargeComponentLoader />}>
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
