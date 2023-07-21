import Image from "next/image";
import Link from "next/link";
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
    select: { id: true, title: true, authors: true, thumbnail_url: true },
    orderBy: { published_date: "desc" },
  });

  return (
    <div className="flex shrink-0 flex-wrap gap-3 py-3">
      {books?.map((book) => (
        <Link
          href={`/book/${book.id}/${book.title}`}
          key={book.id}
          className="flex w-40 flex-col gap-1"
        >
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
          <div>
            <p>{book.title}</p>
            <p className="text-sm font-normal">{book.authors}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
