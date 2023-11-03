import type { FC } from "react";
import Link from "next/link";

import { type BookBaseInterface } from "~/types/BookCardDataInterface";

import { BookCover } from "../Book/BookCover";
import { TextLoader } from "../ui/Loader";

interface SmallBookCardProps {
  book: BookBaseInterface;
}

export const SmallBookCard: FC<SmallBookCardProps> = ({ book }) => {
  return (
    <Link
      href={`/book/${book.id}/${book.title}`}
      className="flex w-32 flex-none snap-center flex-col items-center gap-1 py-0.5 md:snap-start"
    >
      <BookCover coverUrl={book.thumbnail_url} />
      <div className="self-start">
        <h1 className="line-clamp-2">{book.title}</h1>
        <p className="text-sm text-black-light dark:text-white-dark">
          {book.authors.join(", ")}
        </p>
      </div>
    </Link>
  );
};

export const SmallBookCardLoader: FC = () => {
  return (
    <div className="flex w-32 flex-none animate-pulse snap-center flex-col items-center gap-1 py-0.5 md:snap-start">
      <BookCover coverUrl={null} />
      <div className="flex w-full flex-col gap-0.5">
        <TextLoader height="h1" className="w-full" />
        <TextLoader height="h1" className="w-3/4" />
      </div>
    </div>
  );
};
