import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { z } from "zod";

import { BookCover } from "~/components/Book/BookCover";
import { BookDetails } from "~/components/Book/BookDetails";
import { ManageBookshelf } from "~/components/Book/ManageBookshelf";
import { ManageLikes } from "~/components/Book/ManageLikes";
import { ManageOwnedAs } from "~/components/Book/ManageOwnedAs";
import { ManageReviews } from "~/components/Book/ManageReviews";
import { db } from "~/lib/db";
import { arithmeticMeanOfScores } from "~/utils/arithmeticMean";

export default async function BookLayout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  try {
    z.string().uuid().parse(id);
  } catch (error) {
    notFound();
  }

  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const [book, bookScores, myData] = await Promise.all([
    db.book.findUnique({
      where: { id: id },
      include: {
        _count: { select: { liked_by: true } },
      },
    }),
    db.review.findMany({
      where: { book_id: id },
      select: { score: true },
    }),
    session?.user &&
      db.profile.findUnique({
        where: { id: session.user.id },
        select: {
          bookshelf: { where: { book_id: id } },
          book_owned_as: { where: { book_id: id } },
          review: { where: { book_id: id }, select: { created_at: true } },
          _count: { select: { liked_book: { where: { book_id: id } } } },
        },
      }),
  ]);

  if (!book) notFound();

  const myBookshelfData = myData?.bookshelf?.[0];
  const myOwnedAsData = myData?.book_owned_as?.[0];
  const myReviewData = myData?.review?.[0];

  return (
    <div className="container pb-6 pt-12 text-sm">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-x-10 gap-y-8 px-1 xs:px-3 md:flex-row md:justify-between md:px-6">
          <div className="flex gap-1 xs:gap-3">
            <BookCover size="lg" coverUrl={book.thumbnail_url} />

            <div className="mt-0.5 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h1 className="text-base font-semibold">{book.title}</h1>
                {book.subtitle && <h2>{book.subtitle}</h2>}
              </div>

              <p className="text-black-light dark:text-white-dark">
                {book.authors.join(", ")}
              </p>

              <div className="flex flex-col">
                {book.publisher && (
                  <BookDetails variant="publisher:" text={book.publisher} />
                )}
                <BookDetails
                  variant="release date:"
                  text={book.published_date}
                />
              </div>

              {book.page_count !== 0 ||
                (book.categories.length > 0 && (
                  <div className="flex flex-col gap-1">
                    {book.page_count !== 0 && (
                      <BookDetails variant="pages:" text={book.page_count} />
                    )}
                    {book.categories.length > 0 && (
                      <BookDetails
                        variant="genre:"
                        text={book.categories.join(", ")}
                      />
                    )}
                  </div>
                ))}

              <BookDetails
                variant="averge score:"
                text={`${arithmeticMeanOfScores(bookScores)}/5`}
              />
            </div>
          </div>
          <div className="flex flex-wrap content-start justify-center gap-8 px-2 md:max-w-[400px] md:justify-end">
            <div className="flex h-fit flex-wrap items-start justify-center gap-x-4 gap-y-5 sm:justify-between">
              <div className="w-36">
                <ManageBookshelf
                  bookId={book.id}
                  bookshelf={myBookshelfData?.bookshelf}
                  updatedAt={myBookshelfData?.updated_at}
                  beganReadingAt={myBookshelfData?.began_reading_at}
                  readQuantity={myBookshelfData?.read_quantity}
                />
              </div>
              <div className="w-36">
                <ManageOwnedAs
                  bookId={book.id}
                  addedEbookAt={myOwnedAsData?.added_ebook_at}
                  addedAudiobookAt={myOwnedAsData?.added_audiobook_at}
                  addedBookAt={myOwnedAsData?.added_book_at}
                />
              </div>
            </div>
            <div className="flex h-fit flex-wrap items-start justify-center gap-x-4 gap-y-5 sm:justify-between">
              <div className="w-36">
                <ManageLikes
                  bookId={book.id}
                  doILikeThisBook={!!myData?._count.liked_book}
                  likesQuantity={book._count.liked_by}
                />
              </div>
              <div className="w-36">
                <ManageReviews
                  isReviewExists={!!myData?.review}
                  reviewsQuantity={bookScores.length}
                  createdAt={myReviewData?.created_at}
                />
              </div>
            </div>
          </div>
        </div>
        {book.description && (
          <BookDetails variant="description:" text={book.description} />
        )}
        {children}
      </div>
    </div>
  );
}
