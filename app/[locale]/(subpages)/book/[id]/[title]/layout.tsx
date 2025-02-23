import { Suspense } from "react";
import { type Metadata } from "next";

import { Book } from "~/components/Book/Book";
import { BackCategoryLink } from "~/components/Links/BackCategoryLink";
import { LoadingPage } from "~/components/ui/Loaders/LoadingPage";
import { getBookPreview } from "~/lib/services/book/queries";
import ROUTES from "~/utils/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; title: string }>;
}): Promise<Metadata> {
  const { id, title } = await params;
  const { data: bookData } = await getBookPreview(id);

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
      <BackCategoryLink href={ROUTES.root} />
      <Suspense key={"Book"} fallback={<LoadingPage />}>
        <Book bookId={id}>{children}</Book>
      </Suspense>
    </div>
  );
}
