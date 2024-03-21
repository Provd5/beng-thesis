import type { FC } from "react";

import { type BookshelfPreviewType } from "~/types/data/bookshelf";

import { LinkToBook } from "../Links/LinkToBook";
import { BookCover } from "./BookCover";

interface SmallBookCardProps {
  bookData: BookshelfPreviewType;
}

export const SmallBookCard: FC<SmallBookCardProps> = ({ bookData }) => {
  return (
    <LinkToBook
      bookId={bookData.id}
      bookTitle={bookData.title}
      className="flex w-32 flex-none snap-center flex-col items-center gap-1 py-0.5 md:snap-start"
    >
      <BookCover coverUrl={bookData.thumbnail_url} />
      <div className="self-start">
        <h1 className="line-clamp-2">{bookData.title}</h1>
        <p className="text-sm text-black-light dark:text-white-dark">
          {bookData.authors.join(", ")}
        </p>
      </div>
    </LinkToBook>
  );
};
