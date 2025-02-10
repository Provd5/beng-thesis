import type { FC } from "react";

import { type BookshelfPreviewType } from "~/types/data/bookshelf";

import ROUTES from "~/utils/routes";

import { LinkWithFrom } from "../Links/LinkToBook";
import { BookCover } from "./BookCover";

interface SmallBookCardProps {
  bookData: BookshelfPreviewType;
}

export const SmallBookCard: FC<SmallBookCardProps> = ({ bookData }) => {
  return (
    <LinkWithFrom
      href={ROUTES.book.root(bookData.id, bookData.title)}
      className="flex w-32 flex-none snap-center flex-col items-center gap-1 py-0.5 transition-transform hover:-translate-y-1 md:snap-start"
    >
      <BookCover coverUrl={bookData.thumbnail_url} />
      <div className="self-start">
        <h1 className="line-clamp-2">{bookData.title}</h1>
        <p className="text-sm text-colors-text">
          {bookData.authors.join(", ")}
        </p>
      </div>
    </LinkWithFrom>
  );
};
