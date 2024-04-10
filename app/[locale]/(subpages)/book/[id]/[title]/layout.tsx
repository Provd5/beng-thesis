import { Suspense } from "react";
import { type Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";

import { Book } from "~/components/Book/Book";
import { BackFrom } from "~/components/Links/BackCategoryLink";
import { BookLoader } from "~/components/ui/Loaders/Skeletons/BookLoader";
import { type localeTypes } from "~/i18n";
import { getBookPreview } from "~/lib/services/book";

export async function generateMetadata({
  params,
}: {
  params: { id: string; title: string };
}): Promise<Metadata> {
  const bookData = await getBookPreview(params.id);

  if (!bookData)
    return {
      title: decodeURIComponent(params.title),
    };

  return {
    title: bookData.title,
    openGraph: bookData.thumbnail_url
      ? { images: { url: bookData.thumbnail_url } }
      : {},
  };
}

export default function BookLayout({
  children,
  params: { id, locale },
}: {
  children: React.ReactNode;
  params: { id: string; locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  return (
    <div className="container pb-12 pt-8">
      <BackFrom />
      <Suspense key={"Book"} fallback={<BookLoader />}>
        <Book bookId={id}>{children}</Book>
      </Suspense>
    </div>
  );
}
