import type { FC } from "react";
import Link from "next/link";
import { type bookshelfType } from "@prisma/client";

import { db } from "~/lib/db";

import { BookCover } from "../Book/BookCover";
import { type categoryTypes } from "../ui/CategoryLink";

interface CategoryContentCardProps {
  bookshelfVariant: categoryTypes;
  userId: string;
}

type ownedDataType = {
  added_book_at: Date | null;
  added_ebook_at: Date | null;
  added_audiobook_at: Date | null;
  book: {
    id: string;
    title: string;
    authors: string[];
    thumbnail_url: string | null;
    _count: { liked_by: number; review: number };
    bookshelf: { bookshelf: bookshelfType | null }[];
  };
};

type bookDataType = {
  book: {
    id: string;
    title: string;
    authors: string[];
    thumbnail_url: string | null;
  };
};

export const CategoryContentCard: FC<CategoryContentCardProps> = async ({
  bookshelfVariant,
  userId,
}) => {
  let ownedData: ownedDataType[] | null = null;
  let bookData: bookDataType[] = [];

  const commonSelect = {
    book: {
      select: { id: true, title: true, authors: true, thumbnail_url: true },
    },
  };

  switch (bookshelfVariant) {
    case "OWNED":
      ownedData = await db.book_owned_as.findMany({
        take: 10,
        orderBy: [
          { added_book_at: "desc" },
          { added_ebook_at: "desc" },
          { added_audiobook_at: "desc" },
        ],
        where: { user_id: userId },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              authors: true,
              thumbnail_url: true,
              _count: { select: { liked_by: true, review: true } },
              bookshelf: { select: { bookshelf: true } },
            },
          },
        },
      });
      break;
    case "LIKED":
      bookData = await db.liked_books.findMany({
        take: 10,
        orderBy: { updated_at: "desc" },
        where: { user_id: userId },
        select: commonSelect,
      });
      break;
    case "REVIEWS":
      bookData = await db.review.findMany({
        take: 10,
        orderBy: [{ created_at: "desc" }, { updated_at: "desc" }],
        where: { author_id: userId },
        select: commonSelect,
      });
      break;

    default:
      bookData = await db.bookshelf.findMany({
        take: 10,
        orderBy: { updated_at: "desc" },
        where: { bookshelf: bookshelfVariant, user_id: userId },
        select: commonSelect,
      });
      break;
  }

  return (ownedData ? ownedData : bookData).map((data) => (
    <Link
      key={data.book.id}
      href={`/book/${data.book.id}/${data.book.title}`}
      className="flex w-32 flex-none snap-center flex-col items-center gap-1 py-0.5 md:snap-start"
    >
      <BookCover coverUrl={data.book.thumbnail_url}>
        {/* {(data typeof ownedDataType) && <div className="absolute inset-0">
{data.book._count.liked_by > 0 && <BookmarksWrapper  />}
            </div>} */}
      </BookCover>
      <div className="self-start">
        <h1 className="line-clamp-2">{data.book.title}</h1>
        <p className="text-sm font-normal text-black-light dark:text-white-dark">
          {data.book.authors.join(", ")}
        </p>
      </div>
    </Link>
  ));
};
