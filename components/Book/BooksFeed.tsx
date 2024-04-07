import { type FC } from "react";
import { type ReadonlyURLSearchParams } from "next/navigation";

import { SortBooksArray } from "~/types/orderArrays";

import { getAllBooks } from "~/lib/services/book";

import { FeedSort } from "../Modals/FeedSort";
import { ItemsFound } from "../Search/ItemsFound";
import { NotFoundItems } from "../ui/NotFound/NotFoundItems";
import { BookCard } from "./BookCard";

interface BooksFeedProps {
  searchParams: ReadonlyURLSearchParams;
  q?: string;
}

export const BooksFeed: FC<BooksFeedProps> = async ({ searchParams, q }) => {
  const books = await getAllBooks(searchParams, q);

  return (
    <>
      {q && <ItemsFound itemsFound={books.allItems} />}
      {books.allItems === 0 ? (
        <NotFoundItems />
      ) : (
        <FeedSort
          currentPage={books.page}
          totalPages={books.totalPages}
          orderArray={SortBooksArray}
        >
          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
            {books.data.map((book) => (
              <BookCard key={book.book.id} bookData={book} />
            ))}
          </div>
        </FeedSort>
      )}
    </>
  );
};
