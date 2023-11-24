import { type Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { z } from "zod";

import { BookCover } from "~/components/Book/BookCover";
import { BookDetails } from "~/components/Book/BookDetails";
import { ManageBookshelf } from "~/components/Book/Manage/ManageBookshelf";
import { ManageLikes } from "~/components/Book/Manage/ManageLikes";
import { ManageOwnedAs } from "~/components/Book/Manage/ManageOwnedAs";
import { ManageReviews } from "~/components/Book/Manage/ManageReviews";
import { BackCategoryButton } from "~/components/ui/BackCategoryLink";
import { db } from "~/lib/db";
import { averageRating } from "~/utils/averageRating";

export function generateMetadata({
  params,
}: {
  params: { title: string };
}): Metadata {
  return {
    title: decodeURIComponent(params.title),
  };
}

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

  const [book, bookRates] = await Promise.all([
    db.book.findUnique({
      where: { id: id },
      include: {
        _count: { select: { liked_by: true } },
      },
    }),
    db.review.findMany({
      where: { book_id: id },
      select: { rate: true },
    }),
  ]);

  if (!book) notFound();

  const myData =
    session?.user &&
    (await db.profile.findUnique({
      where: { id: session.user.id },
      select: {
        bookshelf: {
          where: { book_id: id },
          select: {
            bookshelf: true,
            updated_at: true,
            began_reading_at: true,
            read_quantity: true,
          },
        },
        book_owned_as: {
          where: { book_id: id },
          select: {
            added_audiobook_at: true,
            added_book_at: true,
            added_ebook_at: true,
          },
        },
        review: { where: { book_id: id }, select: { created_at: true } },
        liked_book: { where: { book_id: id }, select: { updated_at: true } },
      },
    }));

  const myBookshelfData = myData?.bookshelf?.[0];
  const myOwnedAsData = myData?.book_owned_as?.[0];
  const myReviewData = myData?.review?.[0];
  const doILikeThisBook = !!myData?.liked_book.length;
  const isReviewExists = !!myData?.review.length;

  return (
    <div className="container pb-12 pt-8 text-sm">
      <BackCategoryButton />
      <div className="mt-3 flex flex-col gap-8">
        <div className="flex flex-col gap-x-10 gap-y-8 px-1 xs:px-3 md:flex-row md:justify-between md:px-6">
          <div className="flex gap-3">
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

              {(book.page_count !== 0 || book.categories.length > 0) && (
                <div className="flex flex-col gap-1">
                  {book.page_count !== 0 && (
                    <BookDetails
                      variant="pages:"
                      text={book.page_count.toString()}
                    />
                  )}
                  {book.categories.length > 0 && (
                    <BookDetails
                      variant="genre:"
                      text={book.categories.join(", ")}
                    />
                  )}
                </div>
              )}

              <BookDetails
                variant="averge rate:"
                text={`${averageRating(bookRates)}/5`}
              />
            </div>
          </div>
          <div className="flex justify-center gap-x-1 gap-y-4 max-xs:flex-wrap xs:gap-8 xs:px-2 md:justify-end">
            <div className="flex h-fit flex-col items-start justify-center gap-4 xs:gap-8">
              <div className="w-36">
                {session?.user.id && (
                  <ManageBookshelf
                    bookId={book.id}
                    bookshelf={myBookshelfData?.bookshelf}
                    updatedAt={myBookshelfData?.updated_at}
                    beganReadingAt={myBookshelfData?.began_reading_at}
                    readQuantity={myBookshelfData?.read_quantity}
                  />
                )}
              </div>
              <div className="w-36">
                <ManageLikes
                  bookId={book.id}
                  doILikeThisBook={doILikeThisBook}
                  likesQuantity={book._count.liked_by}
                  sessionId={session?.user.id}
                />
              </div>
            </div>
            <div className="flex h-fit flex-col items-start justify-center gap-4 xs:gap-8">
              <div className="w-36">
                {session?.user.id && (
                  <ManageOwnedAs
                    bookId={book.id}
                    addedEbookAt={myOwnedAsData?.added_ebook_at}
                    addedAudiobookAt={myOwnedAsData?.added_audiobook_at}
                    addedBookAt={myOwnedAsData?.added_book_at}
                  />
                )}
              </div>
              <div className="w-36">
                <ManageReviews
                  isReviewExists={isReviewExists}
                  reviewsQuantity={bookRates.length}
                  createdAt={myReviewData?.created_at}
                  sessionId={session?.user.id}
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
