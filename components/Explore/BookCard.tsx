"use client";

import type { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  type BookOwnedAsInterface,
  type BookshelfInterface,
} from "~/types/DataTypes";

import { averageRating } from "~/utils/averageRating";
import { hrefToBook } from "~/utils/hrefToBook";

import { BookCover } from "../Book/BookCover";
import { ManageBookshelf } from "../Book/Manage/ManageBookshelf";
import { ManageLikes } from "../Book/Manage/ManageLikes";
import { ManageOwnedAs } from "../Book/Manage/ManageOwnedAs";
import { BookCardDetails } from "./BookCardDetails";

interface BookCardProps {
  bookData: BookInterface;
  sessionId: string | undefined;
}

export const BookCard: FC<BookCardProps> = ({ bookData, sessionId }) => {
  const pathname = usePathname();

  const myOwnedAsData = bookData.book_owned_as
    ? (bookData.book_owned_as[0] as BookOwnedAsInterface)
    : undefined;
  const myBookshelfData = bookData.bookshelf
    ? (bookData.bookshelf[0] as BookshelfInterface)
    : undefined;
  const doILikeThisBook = !!bookData.liked_by?.length;

  return (
    <div className="flex justify-start gap-3 sm:justify-center lg:justify-start">
      <Link
        href={hrefToBook(bookData.id, bookData.title, pathname)}
        className="h-fit w-fit"
      >
        <BookCover coverUrl={bookData.thumbnail_url} />
      </Link>
      <div className="flex flex-col gap-1 xs:grow">
        <Link
          href={hrefToBook(bookData.id, bookData.title, pathname)}
          className="h-fit w-fit max-w-[300px] py-0.5 leading-tight"
        >
          <h1 className="line-clamp-2">{bookData.title}</h1>
          <h2 className="text-sm text-black-light dark:text-white-dark">
            {bookData.authors.join(", ")}
          </h2>
        </Link>
        <div className="flex w-11/12 flex-wrap justify-between gap-0 gap-y-3">
          <div className="flex flex-col justify-between text-sm">
            <div className="h-14 w-36">
              <BookCardDetails
                ratesQuantity={averageRating(bookData.review)}
                reviewsQuantity={bookData._count.review}
              />
            </div>
            <div className="h-14 w-36">
              <ManageLikes
                bookId={bookData.id}
                doILikeThisBook={doILikeThisBook}
                likesQuantity={bookData._count.liked_by}
                sessionId={sessionId}
              />
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div className="h-14 w-36">
              {!!sessionId && (
                <ManageOwnedAs
                  bookId={bookData.id}
                  addedEbookAt={myOwnedAsData?.added_ebook_at}
                  addedAudiobookAt={myOwnedAsData?.added_audiobook_at}
                  addedBookAt={myOwnedAsData?.added_book_at}
                  size="sm"
                />
              )}
            </div>
            <div className="h-14 w-36">
              {!!sessionId && (
                <ManageBookshelf
                  bookId={bookData.id}
                  bookshelf={myBookshelfData?.bookshelf}
                  updatedAt={myBookshelfData?.updated_at}
                  beganReadingAt={myBookshelfData?.began_reading_at}
                  readQuantity={myBookshelfData?.read_quantity}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
