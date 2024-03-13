import { notFound } from "next/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { categoryArray, type CategoryTypes } from "~/types/CategoryTypes";

import { BooksFeed } from "~/components/Feed/BooksFeed";
import { BookshelfPageTitle } from "~/components/Profile/Bookshelf/BookshelfPageTitle";
import { type localeTypes } from "~/i18n";
import { fetchBooksInCategoryCount } from "~/lib/actions/feed/books";
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

export default async function BookshelfPage({
  params: { bookshelf, fullname, locale },
  searchParams,
}: {
  params: { bookshelf: string; fullname: string; locale: localeTypes };
  searchParams?: {
    orderBy?: string;
    order?: "asc" | "desc";
    page?: string;
    q?: string;
  };
}) {
  unstable_setRequestLocale(locale);

  const bookshelfAsType = convertPathnameToTypeEnum(bookshelf) as CategoryTypes;

  if (!categoryArray.includes(bookshelfAsType)) notFound();

  const booksCount = await fetchBooksInCategoryCount(bookshelfAsType, fullname);

  return (
    <div className="flex flex-col">
      <BookshelfPageTitle
        booksQuantity={booksCount}
        categoryVariant={bookshelfAsType}
      />
      <BooksFeed
        variant={bookshelfAsType}
        fullname={fullname}
        searchParams={searchParams}
        booksCount={booksCount}
      />
    </div>
  );
}
