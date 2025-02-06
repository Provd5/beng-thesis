import { Suspense } from "react";
import { type Metadata } from "next";

import { Book } from "~/components/Book/Book";
import { BackFrom } from "~/components/Links/BackCategoryLink";
import { BookLoader } from "~/components/ui/Loaders/Skeletons/BookLoader";
import { getBookPreview } from "~/lib/services/book/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; title: string }>;
}): Promise<Metadata> {
  const { id, title } = await params;
  const bookData = await getBookPreview(id);

  if (!bookData)
    return {
      title: decodeURIComponent(title),
    };

  return {
    title: bookData.title,
    openGraph: {
      images: bookData.thumbnail_url ? [bookData.thumbnail_url] : undefined,
    },
  };
}

export default async function BookLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container pb-12 pt-8">
      <BackFrom />
      <Suspense key={"Book"} fallback={<BookLoader />}>
        <Book bookId={id}>{children}</Book>
      </Suspense>
    </div>
  );
}
