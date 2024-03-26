import { type FC } from "react";

import { type GetBookInterface } from "~/types/data/book";

import { LinkToBook } from "../Links/LinkToBook";
import { BookCover } from "./BookCover";
import { ManageBookshelf } from "./Bookshelf/ManageBookshelf";
import { ManageLikes } from "./Liked/ManageLikes";
import { ManageOwnedAs } from "./OwnedAs/ManageOwnedAs";
import { AverageRate } from "./Reviews/AverageRate";
import { ReviewsQuantity } from "./Reviews/ReviewsQuantity";

interface BookCardProps {
  bookData: GetBookInterface;
}

export const BookCard: FC<BookCardProps> = ({ bookData }) => {
  return (
    <div className="flex justify-start gap-3 sm:justify-center lg:justify-start">
      <LinkToBook
        className="h-fit w-fit"
        bookId={bookData.book.id}
        bookTitle={bookData.book.title}
      >
        <BookCover coverUrl={bookData.book.thumbnail_url} />
      </LinkToBook>
      <div className="flex flex-col gap-1 xs:grow">
        <LinkToBook
          className="h-fit w-fit max-w-[300px] py-0.5 leading-tight"
          bookId={bookData.book.id}
          bookTitle={bookData.book.title}
        >
          <h1 className="line-clamp-2">{bookData.book.title}</h1>
          <h2 className="text-sm text-black-light dark:text-white-dark">
            {bookData.book.authors.join(", ")}
          </h2>
        </LinkToBook>
        <div className="flex w-11/12 flex-wrap justify-between gap-0 gap-y-3">
          <div className="flex flex-col justify-between text-sm">
            <div className="h-14 w-36">
              <div className="flex gap-3">
                <AverageRate averageRate={bookData._avg_rate} />
                <ReviewsQuantity reviewsQuantity={bookData._count.review} />
              </div>
            </div>
            <div className="h-14 w-36">
              <ManageLikes
                bookId={bookData.book.id}
                likesQuantity={bookData._count.liked_by}
                likeData={bookData.liked_by}
              />
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="h-14 w-36">
              <ManageOwnedAs
                bookId={bookData.book.id}
                ownedAsData={bookData.book_owned_as}
              />
            </div>
            <div className="h-14 w-36">
              <ManageBookshelf
                bookId={bookData.book.id}
                bookshelfData={bookData.bookshelf}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
