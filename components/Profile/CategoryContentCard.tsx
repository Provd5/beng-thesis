import type { FC } from "react";
import Link from "next/link";
import { type bookshelfType } from "@prisma/client";

import { type categoryTypes } from "~/types/categoryTypes";

import { getOwnedAsIcon } from "~/components/ui/getOwnedAsIcon";
import { db } from "~/lib/db";

import { BookCover } from "../Book/BookCover";
import { getBookmarkIcon } from "../ui/getBookmarkIcon";

interface CategoryContentCardProps {
  bookshelfVariant: categoryTypes;
  userId: string;
}

type ownedAsDataType = {
  added_audiobook_at: Date | null;
  added_book_at: Date | null;
  added_ebook_at: Date | null;
  book: {
    id: string;
    title: string;
    authors: string[];
    thumbnail_url: string | null;
    _count: {
      liked_by: number;
      review: number;
    };
    bookshelf: {
      bookshelf: bookshelfType | null;
    }[];
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
  let ownedAsData: ownedAsDataType[] | null = null;
  let bookData: bookDataType[] = [];

  const commonSelect = {
    book: {
      select: { id: true, title: true, authors: true, thumbnail_url: true },
    },
  };

  switch (bookshelfVariant) {
    case "OWNED":
      ownedAsData = await db.book_owned_as.findMany({
        take: 10,
        orderBy: [
          { added_book_at: "desc" },
          { added_ebook_at: "desc" },
          { added_audiobook_at: "desc" },
        ],
        where: { user_id: userId },
        select: {
          added_audiobook_at: true,
          added_book_at: true,
          added_ebook_at: true,
          book: {
            select: {
              id: true,
              title: true,
              authors: true,
              thumbnail_url: true,
              _count: {
                select: {
                  liked_by: { where: { user_id: userId } },
                  review: { where: { author_id: userId } },
                },
              },
              bookshelf: {
                where: { user_id: userId },
                select: { bookshelf: true },
              },
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
    case "STATISTICS":
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

  return (ownedAsData || bookData).map(
    (data: ownedAsDataType | bookDataType) => (
      <Link
        key={data.book.id}
        href={`/book/${data.book.id}/${data.book.title}`}
        className="flex w-32 flex-none snap-center flex-col items-center gap-1 py-0.5 md:snap-start"
      >
        <BookCover coverUrl={data.book.thumbnail_url}>
          {"added_audiobook_at" in data && (
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-black-dark/20">
              <div className="flex self-end p-1">
                {data.book._count.liked_by > 0 && getBookmarkIcon("LIKED")}
                {data.book._count.review > 0 && getBookmarkIcon("REVIEWS")}
                {data.book.bookshelf.length > 0 &&
                  getBookmarkIcon(
                    data.book.bookshelf[0].bookshelf as bookshelfType
                  )}
              </div>
              <div className="flex gap-0.5 p-1">
                {data.added_book_at && getOwnedAsIcon("BOOK", "sm")}
                {data.added_ebook_at && getOwnedAsIcon("EBOOK", "sm")}
                {data.added_audiobook_at && getOwnedAsIcon("AUDIOBOOK", "sm")}
              </div>
            </div>
          )}
        </BookCover>
        <div className="self-start">
          <h1 className="line-clamp-2">{data.book.title}</h1>
          <p className="text-sm text-black-light dark:text-white-dark">
            {data.book.authors.join(", ")}
          </p>
        </div>
      </Link>
    )
  );
};
