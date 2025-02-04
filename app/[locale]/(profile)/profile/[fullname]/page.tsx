import { Suspense } from "react";
import { type Metadata } from "next";
import { type Formats, type TranslationValues } from "next-intl";
import { getTranslations } from "next-intl/server";

import { BookshelvesArray, type BookshelvesTypes } from "~/types/consts";

import { BookshelfContainer } from "~/components/Bookshelf/BookshelfContainer";
import { BookshelfFeed } from "~/components/Bookshelf/BookshelfFeed";
import { ReviewBookshelfFeed } from "~/components/Bookshelf/ReviewBookshelfFeed";
import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";
import { type localeTypes } from "~/i18n/routing";
import {
  convertPathnameToTypeEnum,
  convertTypeEnumToPathname,
} from "~/utils/pathnameTypeEnumConverter";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { fullname: string; locale: localeTypes };
  searchParams: { bookshelf?: string };
}): Promise<Metadata> {
  const { fullname, locale } = await params;
  const awaitedSearchParams = await searchParams;
  const t = (await getTranslations({
    locale,
    namespace: "Nav.CategoryTitles",
  })) as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined,
  ) => string;
  const bookshelfAsEnum = awaitedSearchParams.bookshelf
    ? (convertPathnameToTypeEnum(
        awaitedSearchParams.bookshelf,
      ) as BookshelvesTypes)
    : "ALREADY_READ";
  const validBookshelf: BookshelvesTypes = BookshelvesArray.includes(
    bookshelfAsEnum,
  )
    ? bookshelfAsEnum
    : "ALREADY_READ";

  return {
    title: `@${decodeURIComponent(fullname)}/${t(
      convertTypeEnumToPathname(validBookshelf),
    )}`,
  };
}

export default async function BookshelfPage({
  params,
  searchParams,
}: {
  params: { fullname: string };
  searchParams: { bookshelf?: string };
}) {
  const { fullname } = await params;
  const awaitedSearchParams = await searchParams;

  const bookshelfAsEnum = awaitedSearchParams.bookshelf
    ? (convertPathnameToTypeEnum(
        awaitedSearchParams.bookshelf,
      ) as BookshelvesTypes)
    : "ALREADY_READ";

  const validBookshelf: BookshelvesTypes = BookshelvesArray.includes(
    bookshelfAsEnum,
  )
    ? bookshelfAsEnum
    : "ALREADY_READ";

  return (
    <BookshelfContainer bookshelf={validBookshelf}>
      {validBookshelf === "REVIEWS" ? (
        <Suspense
          key={`BookshelfPage-${fullname}-${validBookshelf}`}
          fallback={<LargeComponentLoader />}
        >
          <ReviewBookshelfFeed
            profileName={fullname}
            searchParams={awaitedSearchParams}
          />
        </Suspense>
      ) : (
        <Suspense
          key={`BookshelfPage-${fullname}-${validBookshelf}`}
          fallback={<LargeComponentLoader />}
        >
          <BookshelfFeed
            profileName={fullname}
            bookshelf={validBookshelf}
            searchParams={awaitedSearchParams}
          />
        </Suspense>
      )}
    </BookshelfContainer>
  );
}
