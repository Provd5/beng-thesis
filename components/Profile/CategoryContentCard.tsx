import type { FC } from "react";
import Link from "next/link";

import { type categoryTypes } from "~/types/categoryTypes";

import { db } from "~/lib/db";

import { BookCover } from "../Book/BookCover";

interface CategoryContentCardProps {
  categoryVariant: categoryTypes;
  userId: string;
}

type bookDataType = {
  book: {
    id: string;
    title: string;
    authors: string[];
    thumbnail_url: string | null;
  };
};

export const CategoryContentCard: FC<CategoryContentCardProps> = async ({
  categoryVariant,
  userId,
}) => {
  let books: bookDataType[] = [];

  const commonSelect = {
    book: {
      select: { id: true, title: true, authors: true, thumbnail_url: true },
    },
  };

  switch (categoryVariant) {
    case "OWNED":
      books = await db.book_owned_as.findMany({
        take: 10,
        orderBy: [
          { added_book_at: "desc" },
          { added_ebook_at: "desc" },
          { added_audiobook_at: "desc" },
        ],
        where: {
          user_id: userId,
          NOT: {
            AND: [
              { added_audiobook_at: null },
              { added_book_at: null },
              { added_ebook_at: null },
            ],
          },
        },
        select: commonSelect,
      });
      break;
    case "LIKED":
      books = await db.liked_books.findMany({
        take: 10,
        orderBy: { updated_at: "desc" },
        where: { user_id: userId },
        select: commonSelect,
      });
      break;
    case "REVIEWS":
      books = await db.review.findMany({
        take: 10,
        orderBy: [{ created_at: "desc" }, { updated_at: "desc" }],
        where: { author_id: userId },
        select: commonSelect,
      });
      break;
    case "STATISTICS":
      break;
    default:
      books = await db.bookshelf.findMany({
        take: 10,
        orderBy: { updated_at: "desc" },
        where: { bookshelf: categoryVariant, user_id: userId },
        select: commonSelect,
      });
      break;
  }

  return books.map(({ book }) => (
    <Link
      key={book.id}
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
  ));
};
