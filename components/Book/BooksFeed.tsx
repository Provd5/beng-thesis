import { type FC } from "react";

import { SortBooksArray } from "~/types/orderArrays";

import { getAllBooks } from "~/lib/services/book/queries";
import { getSessionUser } from "~/lib/services/session/queries";

import { FeedSort } from "../Modals/FeedSort";
import { ItemsFound } from "../Search/ItemsFound";
import { NotFoundItems } from "../ui/NotFound/NotFoundItems";
import { BookCard } from "./BookCard";

interface BooksFeedProps {
  searchParams: unknown;
  q?: string;
}

export const BooksFeed: FC<BooksFeedProps> = async ({ searchParams, q }) => {
  const sessionUser = await getSessionUser();
  const { data: books, error } = await getAllBooks(
    sessionUser?.id,
    searchParams,
    q,
  );

  if (error || !books) throw new Error(error);

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
