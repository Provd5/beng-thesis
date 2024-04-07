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
    <div className="flex gap-3 rounded-md px-2 py-3">
      <LinkToBook
        className="size-fit transition-transform hover:-translate-y-1"
        bookId={bookData.book.id}
        bookTitle={bookData.book.title}
      >
        <BookCover coverUrl={bookData.book.thumbnail_url} />
      </LinkToBook>
      <div className="flex w-full flex-col">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div className="flex flex-col gap-1">
            <LinkToBook
              className="size-fit max-w-[300px] py-0.5 leading-tight transition-transform hover:-translate-y-1"
              bookId={bookData.book.id}
              bookTitle={bookData.book.title}
            >
              <h1 className="line-clamp-2">{bookData.book.title}</h1>
              <h2 className="text-sm text-colors-text">
                {bookData.book.authors.join(", ")}
              </h2>
            </LinkToBook>
            <div className="flex flex-col gap-0.5">
              <AverageRate averageRate={bookData._avg_rate} />
              <ReviewsQuantity reviewsQuantity={bookData._count.review} />
            </div>
          </div>
          <div className="flex gap-2 max-md:flex-wrap">
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
          <p className="mt-2 line-clamp-2 text-sm">
            {bookData.book.description}
          </p>
        )}
      </div>
    </div>
  );
};
