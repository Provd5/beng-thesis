import { notFound } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";
import { z } from "zod";

import { BookCover } from "~/components/Book/BookCover";
import { BookDetails } from "~/components/Book/BookDetails";
import { ManageBookshelf } from "~/components/Book/Manage/ManageBookshelf";
import { ManageLikes } from "~/components/Book/Manage/ManageLikes";
import { ManageOwnedAs } from "~/components/Book/Manage/ManageOwnedAs";
import { ManageReviews } from "~/components/Book/Manage/ManageReviews";
import { BackFrom } from "~/components/ui/BackCategoryLink";
import { type localeTypes } from "~/i18n";
import {
  fetchBookData,
  fetchBookNumbers,
  fetchMyBookData,
} from "~/lib/actions/book/fetch";

export function generateMetadata({ params }: { params: { title: string } }) {
  return {
    title: decodeURIComponent(params.title),
  };
}

export default async function BookLayout({
  children,
  params: { id, locale },
}: {
  children: React.ReactNode;
  params: { id: string; locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  try {
    z.string().uuid().parse(id);
  } catch (error) {
    notFound();
  }

  const [bookData, bookNumbers, myData] = await Promise.all([
    fetchBookData(id),
    fetchBookNumbers(id),
    fetchMyBookData(id),
  ]);

  if (!bookData) notFound();

  return (
    <div className="container pb-12 pt-8 text-sm">
      <BackFrom />
      <div className="mt-3 flex flex-col gap-8">
        <div className="flex flex-col gap-x-10 gap-y-8 px-1 xs:px-3 md:flex-row md:justify-between md:px-6">
          <div className="flex gap-3">
            <BookCover size="lg" coverUrl={bookData.thumbnail_url} />

            <div className="mt-0.5 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h1 className="text-base font-semibold">{bookData.title}</h1>
                {bookData.subtitle && <h2>{bookData.subtitle}</h2>}
              </div>

              <p className="text-black-light dark:text-white-dark">
                {bookData.authors.join(", ")}
              </p>

              <div className="flex flex-col">
                {bookData.publisher && (
                  <BookDetails variant="publisher:" text={bookData.publisher} />
                )}
                <BookDetails
                  variant="release date:"
                  text={bookData.published_date}
                />
              </div>

              {(bookData.page_count !== 0 ||
                bookData.categories.length > 0) && (
                <div className="flex flex-col gap-1">
                  {bookData.page_count !== 0 && (
                    <BookDetails
                      variant="pages:"
                      text={bookData.page_count.toString()}
                    />
                  )}
                  {bookData.categories.length > 0 && (
                    <BookDetails
                      variant="genre:"
                      text={bookData.categories.join(", ")}
                    />
                  )}
                </div>
              )}

              <BookDetails
                variant="average rate:"
                text={`${bookNumbers.averageRate}/5`}
              />
            </div>
          </div>
          <div className="flex justify-center gap-x-1 gap-y-4 max-xs:flex-wrap xs:gap-8 xs:px-2 md:justify-end">
            <div className="flex h-fit flex-col items-start justify-center gap-4 xs:gap-8">
              <div className="w-36">
                {!!myData && (
                  <ManageBookshelf
                    bookId={bookData.id}
                    bookshelfData={myData.myBookshelfData}
                  />
                )}
              </div>
              <div className="w-36">
                <ManageLikes
                  bookId={bookData.id}
                  likesQuantity={bookNumbers.likes}
                  doILikeThisBook={!!myData?.doILikeThisBook}
                  isSession={!!myData}
                />
              </div>
            </div>
            <div className="flex h-fit flex-col items-start justify-center gap-4 xs:gap-8">
              <div className="w-36">
                {!!myData && (
                  <ManageOwnedAs
                    bookId={bookData.id}
                    addedEbookAt={myData.myOwnedAsData?.added_ebook_at}
                    addedAudiobookAt={myData.myOwnedAsData?.added_audiobook_at}
                    addedBookAt={myData.myOwnedAsData?.added_book_at}
                  />
                )}
              </div>
              <div className="w-36">
                <ManageReviews
                  isReviewExists={!!myData?.myReviewData?.created_at}
                  reviewsQuantity={bookNumbers.ratesCount}
                  createdAt={myData?.myReviewData?.created_at}
                  isSession={!!myData}
                />
              </div>
            </div>
          </div>
        </div>
        {bookData.description && (
          <BookDetails variant="description:" text={bookData.description} />
        )}
        {children}
      </div>
    </div>
  );
}
