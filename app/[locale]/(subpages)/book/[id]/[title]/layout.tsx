import { Suspense } from "react";
import { unstable_setRequestLocale } from "next-intl/server";

import { Book } from "~/components/Book/Book";
import { BackFrom } from "~/components/Links/BackCategoryLink";
import { BookLoader } from "~/components/ui/Loaders/Skeletons/BookLoader";
import { type localeTypes } from "~/i18n";

export function generateMetadata({ params }: { params: { title: string } }) {
  return {
    title: decodeURIComponent(params.title),
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
