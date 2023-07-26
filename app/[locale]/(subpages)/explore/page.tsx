import Link from "next/link";
import { createTranslator } from "next-intl";

import { BookCover } from "~/components/Book/BookCover";
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
    include: { review: true, liked_by: true },
    // select: { id: true, title: true, authors: true, thumbnail_url: true },
    orderBy: { published_date: "desc" },
  });
  // console.log(books);

  function avargeScore(reviews: { score: number }[]) {
    const lol = reviews.forEach((review) => [review.score]);
    return 0;
  }
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 gap-5 py-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {books?.map((book) => (
          <Link
            href={`/book/${book.id}/${book.title}`}
            key={book.id}
            className="flex flex-col gap-1"
          >
            <div className="flex gap-1 xs:gap-2">
              <BookCover coverUrl={book.thumbnail_url} />
              <div className="flex flex-col gap-3">
                <div className="leading-tight">
                  <h1 className="line-clamp-2">{book.title}</h1>
                  <h2 className="text-sm font-normal text-black-light dark:text-white-dark">
                    {book.authors.join(", ")}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm font-normal">
                  <div className="flex flex-col">
                    <h3 className="bg-gradient-dark bg-clip-text text-base text-transparent dark:bg-gradient-light">
                      Score
                    </h3>
                    <p className="text-md font-medium">0/5</p>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="bg-gradient-dark bg-clip-text text-transparent dark:bg-gradient-light">
                      Likes
                    </h3>
                    <p>{book.liked_by.length ?? 0}</p>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="bg-gradient-dark bg-clip-text text-transparent dark:bg-gradient-light">
                      Reviews
                    </h3>
                    <p>{avargeScore(book.review)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
