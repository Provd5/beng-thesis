import { type FC } from "react";

import { type BookshelvesTypes } from "~/types/consts";
import { SortBookshelvesArray } from "~/types/orderArrays";

import { getBookshelfBooks } from "~/lib/services/bookshelf/queries";
import { getSessionUser } from "~/lib/services/session/queries";

import { BookCard } from "../Book/BookCard";
import { FeedSort } from "../Modals/FeedSort";
import { NotFoundItems } from "../ui/NotFound/NotFoundItems";
import { BookshelfPageTitle } from "./BookshelfPageTitle";

interface BookshelfFeedProps {
  profileName: string;
  bookshelf: Exclude<BookshelvesTypes, "REVIEWS">;
  searchParams: unknown;
}

export const BookshelfFeed: FC<BookshelfFeedProps> = async ({
  bookshelf,
  profileName,
  searchParams,
}) => {
  const sessionUser = await getSessionUser();
  const { data: books, error } = await getBookshelfBooks(
    sessionUser?.id,
    bookshelf,
    profileName,
    searchParams,
  );

  if (error || !books) throw new Error(error);

  return (
    <>
      <BookshelfPageTitle
        booksQuantity={books.allItems}
        bookshelfVariant={bookshelf}
      />
      {books.allItems === 0 ? (
        <NotFoundItems />
      ) : (
        <FeedSort
          currentPage={books.page}
          totalPages={books.totalPages}
          orderArray={SortBookshelvesArray}
        >
          <div className="grid grid-cols-1 gap-2 2xl:grid-cols-2">
            {books.data.map((book) => (
              <BookCard key={book.book.id} bookData={book} />
            ))}
          </div>
        </FeedSort>
      )}
    </>
  );
};
