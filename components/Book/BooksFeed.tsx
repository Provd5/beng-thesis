import { type FC, Suspense } from "react";
import { type ReadonlyURLSearchParams } from "next/navigation";

import { SortBooksArray } from "~/types/orderArrays";

import { BookService } from "~/lib/services/book";

import { FeedSort } from "../Modals/FeedSort";
import { ItemsFound } from "../Search/ItemsFound";
import { BookCardsLoader } from "../ui/Loaders/Skeletons/BookCardLoader";
import { BookCard } from "./BookCard";

interface BooksFeedProps {
  searchParams: ReadonlyURLSearchParams;
  q?: string;
}

export const BooksFeed: FC<BooksFeedProps> = async ({ searchParams, q }) => {
  const bookService = new BookService();
  const books = await bookService.getAllBooks(searchParams, q);

  return (
    <>
      {q && <ItemsFound itemsFound={books.allItems} />}
      <FeedSort orderArray={SortBooksArray} />
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
