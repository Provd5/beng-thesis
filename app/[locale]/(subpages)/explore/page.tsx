import Image from "next/image";
import { createTranslator } from "next-intl";

import { ThumbnailPlaceholder } from "~/components/Book/ThumbnailPlaceholder";
import { db } from "~/lib/db";

import { getMessages, type PageProps } from "../../layout";

export async function generateMetadata({ params: { locale } }: PageProps) {
  const messages = await getMessages(locale);

  const t = createTranslator({ locale, messages });

  return {
    title: t("CategoryTitles.explore"),
  };
}

export default async function ExplorePage() {
  const books = await db.book.findMany({
    orderBy: { published_date: "desc" },
  });

  return (
    <>
      {books?.map((book) => (
        <div key={book.id} className="flex flex-col">
          authors:{book.authors}
          categories:{book.categories}
          description:{book.description}
          id:{book.id}
          isbn_10:{book.isbn_10}
          isbn_13:{book.isbn_13}
          page_count:{book.page_count}
          published_date:{book.published_date}
          publisher:{book.publisher}
          subtitle:{book.subtitle}
          {book.thumbnail_url ? (
            <Image
              alt="Book cover"
              src={book.thumbnail_url}
              width="97"
              height="140"
            />
          ) : (
            <ThumbnailPlaceholder />
          )}
          title:{book.title}
        </div>
      ))}
    </>
  );
}
