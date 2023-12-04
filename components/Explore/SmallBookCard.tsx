import type { FC } from "react";

import { BookCover } from "../Book/BookCover";
import { LinkToBook } from "../Book/LinkToBook";

interface SmallBookCardProps {
  book: BookBaseInterface;
}

export const SmallBookCard: FC<SmallBookCardProps> = ({ book }) => {
  return (
    <LinkToBook
      bookId={book.id}
      bookTitle={book.title}
      className="flex w-32 flex-none snap-center flex-col items-center gap-1 py-0.5 md:snap-start"
    >
      <BookCover coverUrl={book.thumbnail_url} />
      <div className="self-start">
        <h1 className="line-clamp-2">{book.title}</h1>
        <p className="text-sm text-black-light dark:text-white-dark">
          {book.authors.join(", ")}
        </p>
      </div>
    </LinkToBook>
  );
};
