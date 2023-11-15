"use client";

import type { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { hrefToBook } from "~/utils/hrefToBook";

import { BookCover } from "../Book/BookCover";

interface SmallBookCardProps {
  book: BookBaseInterface;
}

export const SmallBookCard: FC<SmallBookCardProps> = ({ book }) => {
  const pathname = usePathname();

  return (
    <Link
      href={hrefToBook(book.id, book.title, pathname)}
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
