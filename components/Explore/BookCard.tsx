import type { FC } from "react";

import { fetchBookNumbers, fetchMyBookData } from "~/lib/actions/book/fetch";

import { BookCover } from "../Book/BookCover";
import { LinkToBook } from "../Book/LinkToBook";
import { ManageBookshelf } from "../Book/Manage/ManageBookshelf";
import { ManageLikes } from "../Book/Manage/ManageLikes";
import { ManageOwnedAs } from "../Book/Manage/ManageOwnedAs";
import { BookCardDetails } from "./BookCardDetails";

interface BookCardProps {
  bookData: BookInterface;
}

export const BookCard: FC<BookCardProps> = async ({ bookData }) => {
  const [myData, bookNumbers] = await Promise.all([
    fetchMyBookData(bookData.id),
    fetchBookNumbers(bookData.id),
  ]);

  return (
    <div className="flex justify-start gap-3 sm:justify-center lg:justify-start">
      <LinkToBook
        className="h-fit w-fit"
        bookId={bookData.id}
        bookTitle={bookData.title}
      >
        <BookCover coverUrl={bookData.thumbnail_url} />
      </LinkToBook>
      <div className="flex flex-col gap-1 xs:grow">
        <LinkToBook
          className="h-fit w-fit max-w-[300px] py-0.5 leading-tight"
          bookId={bookData.id}
          bookTitle={bookData.title}
        >
          <h1 className="line-clamp-2">{bookData.title}</h1>
          <h2 className="text-sm text-black-light dark:text-white-dark">
            {bookData.authors.join(", ")}
          </h2>
        </LinkToBook>
        <div className="flex w-11/12 flex-wrap justify-between gap-0 gap-y-3">
          <div className="flex flex-col justify-between text-sm">
            <div className="h-14 w-36">
              <BookCardDetails
                ratesQuantity={bookNumbers.averageRate}
                reviewsQuantity={bookNumbers.ratesCount}
              />
            </div>
            <div className="h-14 w-36">
              <ManageLikes
                bookId={bookData.id}
                doILikeThisBook={!!myData?.doILikeThisBook}
                likesQuantity={bookNumbers.likes}
                isSession={!!myData}
              />
            </div>
          </div>

          {!!myData && (
            <div className="flex flex-col justify-between">
              <div className="h-14 w-36">
                <ManageOwnedAs
                  bookId={bookData.id}
                  addedEbookAt={myData.myOwnedAsData?.added_ebook_at}
                  addedAudiobookAt={myData.myOwnedAsData?.added_audiobook_at}
                  addedBookAt={myData.myOwnedAsData?.added_book_at}
                  size="sm"
                />
              </div>
              <div className="h-14 w-36">
                <ManageBookshelf
                  bookId={bookData.id}
                  bookshelfData={myData.myBookshelfData}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
