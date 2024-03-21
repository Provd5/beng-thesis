import { type FC, Suspense } from "react";
import { type ReadonlyURLSearchParams } from "next/navigation";

import { type BookshelvesTypes } from "~/types/data/bookshelf";
import { SortBookshelvesArray } from "~/types/orderArrays";

import { BookshelfService } from "~/lib/services/bookshelf";

import { BookCard } from "../Book/BookCard";
import { FeedSort } from "../Modals/FeedSort";
import { BookCardsLoader } from "../ui/Loaders/Skeletons/BookCardLoader";
import { BookshelfPageTitle } from "./BookshelfPageTitle";

interface BookshelfFeedProps {
  profileName: string;
  bookshelf: Exclude<BookshelvesTypes, "REVIEWS">;
  searchParams: ReadonlyURLSearchParams;
}

export const BookshelfFeed: FC<BookshelfFeedProps> = async ({
  bookshelf,
  profileName,
  searchParams,
}) => {
  const bookshelfService = new BookshelfService();
  const books = await bookshelfService.getBookshelfBooks(
    bookshelf,
    profileName,
    searchParams
  );

  return (
    <>
      <BookshelfPageTitle
        booksQuantity={books.allItems}
        bookshelfVariant={bookshelf}
      />
      <FeedSort orderArray={SortBookshelvesArray} />
      <div className="grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-2">
        <Suspense fallback={<BookCardsLoader items={books.itemsPerPage} />}>
          {books.data.map((book) => (
            <BookCard key={book.id} bookData={book} />
          ))}
        </Suspense>
      </div>
    </>
  );
};
