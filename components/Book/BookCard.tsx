import { type FC } from "react";

import { type GetBookInterface } from "~/types/data/book";

import ROUTES from "~/utils/routes";

import { LinkWithFrom } from "../Links/LinkToBook";
import { BookCover } from "./BookCover";
import { ManageBookshelf } from "./Bookshelf/ManageBookshelf";
import { ManageLikes } from "./Liked/ManageLikes";
import { ManageOwnedAs } from "./OwnedAs/ManageOwnedAs";
import { AverageRate } from "./Reviews/AverageRate";
import { ManageReviews } from "./Reviews/ManageReviews";

interface BookCardProps {
  bookData: GetBookInterface;
}

export const BookCard: FC<BookCardProps> = ({ bookData }) => {
  return (
    <div className="rounded-lg bg-white p-2 dark:bg-black">
      <LinkWithFrom
        href={ROUTES.book.root(bookData.book.id, bookData.book.title)}
        className="flex gap-3 transition-transform hover:translate-x-1"
      >
        <BookCover coverUrl={bookData.book.thumbnail_url} />
        <div className="flex flex-col">
          <AverageRate averageRate={bookData._avg_rate} />
          <h1 className="line-clamp-2 font-semibold">{bookData.book.title}</h1>
          <h2 className="text-sm text-colors-text">
            {bookData.book.authors.join(", ")}
          </h2>
          {bookData.book.description && (
            <p className="mt-1 line-clamp-3 text-sm">
              {bookData.book.description}
            </p>
          )}
        </div>
      </LinkWithFrom>
      <div className="mt-1 flex flex-wrap justify-end gap-2 md:justify-center">
        <LinkWithFrom
          href={ROUTES.book.root(bookData.book.id, bookData.book.title)}
          className="contents"
        >
          <ManageReviews
            key={`ManageReviews-${bookData.book.id}`}
            reviewsQuantity={bookData._count.review}
            reviewData={bookData.review}
          />
        </LinkWithFrom>
        <ManageLikes
          key={`ManageLikes-${bookData.book.id}`}
          bookId={bookData.book.id}
          likesQuantity={bookData._count.liked_by}
          likeData={bookData.liked_by}
        />
        <ManageOwnedAs
          key={`ManageOwnedAs-${bookData.book.id}`}
          bookId={bookData.book.id}
          ownedAsData={bookData.book_owned_as}
        />
        <ManageBookshelf
          key={`ManageBookshelf-${bookData.book.id}`}
          bookId={bookData.book.id}
          bookshelfData={bookData.bookshelf}
        />
      </div>
    </div>
  );
};
