import { type FC, Suspense } from "react";
import { notFound } from "next/navigation";

import { HIGHEST_REVIEW_RATE } from "~/types/data/review";

import { getBook } from "~/lib/services/book";

import { BookCover } from "./BookCover";
import { BookDetails } from "./BookDetails";
import { ManageBookshelf } from "./Bookshelf/ManageBookshelf";
import { ManageLikes } from "./Liked/ManageLikes";
import { ManageOwnedAs } from "./OwnedAs/ManageOwnedAs";
import { ManageReviews } from "./Reviews/ManageReviews";

interface BookProps {
  bookId: string;
  children: React.ReactNode;
}

export const Book: FC<BookProps> = async ({ bookId, children }) => {
  const bookData = await getBook(bookId);

  if (!bookData) notFound();

  return (
    <div className="mt-3 flex flex-col gap-8 text-sm">
      <div className="flex flex-col gap-x-10 gap-y-8 px-1 md:px-6">
        <div className="flex gap-3">
          <BookCover size="lg" coverUrl={bookData.book.thumbnail_url} />

          <div className="mt-0.5 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h1 className="text-base font-semibold">{bookData.book.title}</h1>
              {bookData.book.subtitle && <h2>{bookData.book.subtitle}</h2>}
            </div>

            <p className="text-colors-text">
              {bookData.book.authors.join(", ")}
            </p>

            <div className="flex flex-col">
              {bookData.book.publisher && (
                <BookDetails
                  variant="publisher:"
                  text={bookData.book.publisher}
                />
              )}
              <BookDetails
                variant="release date:"
                text={bookData.book.published_date}
              />
            </div>

            {(bookData.book.page_count !== 0 ||
              bookData.book.categories.length > 0) && (
              <div className="flex flex-col gap-1">
                {bookData.book.page_count !== 0 && (
                  <BookDetails
                    variant="pages:"
                    text={bookData.book.page_count.toString()}
                  />
                )}
                {bookData.book.categories.length > 0 && (
                  <BookDetails
                    variant="genre:"
                    text={bookData.book.categories.join(", ")}
                  />
                )}
              </div>
            )}

            <BookDetails
              variant="average rate:"
              text={`${bookData._avg_rate}/${HIGHEST_REVIEW_RATE}`}
            />
          </div>
        </div>
        <div className="flex w-full flex-wrap justify-center gap-2 self-start">
          <Suspense
            fallback={
              <div className="h-[70px] w-36 rounded-md bg-white/90 dark:bg-black/30" />
            }
          >
            <ManageReviews
              bookId={bookData.book.id}
              reviewsQuantity={bookData._count.review}
            />
          </Suspense>
          <ManageLikes
            bookId={bookData.book.id}
            likesQuantity={bookData._count.liked_by}
            likeData={bookData.liked_by}
          />
          <ManageOwnedAs
            bookId={bookData.book.id}
            ownedAsData={bookData.book_owned_as}
          />
          <ManageBookshelf
            bookId={bookData.book.id}
            bookshelfData={bookData.bookshelf}
          />
        </div>
      </div>
      {bookData.book.description && (
        <BookDetails variant="description:" text={bookData.book.description} />
      )}
      {children}
    </div>
  );
};
