import { Suspense } from "react";
import { notFound, type ReadonlyURLSearchParams } from "next/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { BookshelvesArray } from "~/types/categoryArrays";
import { type BookshelvesTypes } from "~/types/data/bookshelf";

import { BookshelfFeed } from "~/components/Bookshelf/BookshelfFeed";
import { ReviewBookshelfFeed } from "~/components/Bookshelf/ReviewBookshelfFeed";
import { Loader } from "~/components/ui/Loaders/Loader";
import { type localeTypes } from "~/i18n";
import { convertPathnameToTypeEnum } from "~/utils/pathnameTypeEnumConverter";

export async function generateMetadata({
  params: { bookshelf, locale },
}: {
  params: { bookshelf: string; locale: localeTypes };
}) {
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
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
    <div className="flex flex-col">
      {validBookshelf === "REVIEWS" ? (
        <Suspense fallback={<Loader />}>
          <ReviewBookshelfFeed
            profileName={fullname}
            searchParams={searchParams}
          />
        </Suspense>
      ) : (
        <Suspense fallback={<Loader />}>
          <BookshelfFeed
            profileName={fullname}
            bookshelf={validBookshelf}
            searchParams={searchParams}
          />
        </Suspense>
      )}
    </div>
  );
}
