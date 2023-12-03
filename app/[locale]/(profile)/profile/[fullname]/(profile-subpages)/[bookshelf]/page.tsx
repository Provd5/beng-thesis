import { notFound } from "next/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { categoryArray, type CategoryTypes } from "~/types/CategoryTypes";
import { bookshelvesOrderByArray } from "~/types/feed/OrderVariants";

import { FeedWithSorting } from "~/components/Feed/FeedWithSorting";
import { BookshelfPageTitle } from "~/components/Profile/Bookshelf/BookshelfPageTitle";
import { type localeTypes } from "~/i18n";
import { fetchCategoryCount } from "~/lib/actions/profile/fetch";
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
}: {
  params: { bookshelf: string; fullname: string; locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  const bookshelfAsType = convertPathnameToTypeEnum(bookshelf) as CategoryTypes;
  if (!categoryArray.includes(bookshelfAsType)) notFound();
  if (bookshelfAsType === "STATISTICS") return;

  const categoryCount = await fetchCategoryCount(fullname, bookshelfAsType);

  return (
    <div className="flex flex-col">
      <BookshelfPageTitle
        booksQuantity={categoryCount}
        categoryVariant={bookshelfAsType}
      />
      <FeedWithSorting
        feedVariant="books"
        takeLimit={categoryCount < 10 ? categoryCount : 10}
        sessionId={undefined}
        profileName={fullname}
        variant={bookshelfAsType}
        orderArray={bookshelvesOrderByArray}
      />
    </div>
  );
}
