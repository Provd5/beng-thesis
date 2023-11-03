import type { FC } from "react";
import Link from "next/link";

import {
  type BookInterface,
  type BookOwnedAsInterface,
  type BookshelfInterface,
} from "~/types/BookCardDataInterface";

import { arithmeticMeanOfScores } from "~/utils/arithmeticMean";

import { BookCover } from "../Book/BookCover";
import { ManageBookshelf } from "../Book/ManageBookshelf";
import { ManageLikes } from "../Book/ManageLikes";
import { ManageOwnedAs } from "../Book/ManageOwnedAs";
import { TextLoader } from "../ui/Loader";
import { BookCardDetails } from "./BookCardDetails";

interface BookCardProps {
  bookData: BookInterface;
}

export const BookCard: FC<BookCardProps> = ({ bookData }) => {
  const myOwnedAsData = bookData.book_owned_as?.[0] as BookOwnedAsInterface;
  const myBookshelfData = bookData.bookshelf?.[0] as BookshelfInterface;
  const doILikeThisBook = !!bookData.liked_by?.length;

  return (
    <div className="flex justify-center gap-3 md:justify-start">
      <Link
        href={`/book/${bookData.id}/${bookData.title}`}
        className="h-fit w-fit"
      >
        <BookCover coverUrl={bookData.thumbnail_url} />
      </Link>
      <div className="flex w-full max-w-[300px] flex-col gap-1">
        <Link
          href={`/book/${bookData.id}/${bookData.title}`}
          className="h-fit w-fit py-0.5 leading-tight"
        >
          <h1 className="line-clamp-2">{bookData.title}</h1>
          <h2 className="text-sm text-black-light dark:text-white-dark">
            {bookData.authors.join(", ")}
          </h2>
        </Link>
        <div className="flex flex-wrap justify-between gap-3 text-sm">
          <BookCardDetails
            scoresQuantity={arithmeticMeanOfScores(bookData.review)}
            reviewsQuantity={bookData._count.review}
          />
          <ManageOwnedAs
            bookId={bookData.id}
            addedEbookAt={myOwnedAsData?.added_ebook_at}
            addedAudiobookAt={myOwnedAsData?.added_audiobook_at}
            addedBookAt={myOwnedAsData?.added_book_at}
            size="sm"
          />
        </div>
        <div className="flex flex-wrap justify-between gap-3">
          <ManageLikes
            bookId={bookData.id}
            doILikeThisBook={doILikeThisBook}
            likesQuantity={bookData._count.liked_by}
          />
          <ManageBookshelf
            bookId={bookData.id}
            bookshelf={myBookshelfData?.bookshelf}
            updatedAt={myBookshelfData?.updated_at}
            beganReadingAt={myBookshelfData?.began_reading_at}
            readQuantity={myBookshelfData?.read_quantity}
          />
        </div>
      </div>
    </div>
  );
};

export const BookCardLoader: FC = () => {
  return (
    <div className="flex animate-pulse justify-center gap-3 md:justify-start">
      <BookCover coverUrl={null} />
      <div className="flex w-full max-w-[300px] flex-col gap-1.5">
        <TextLoader height="h1" className="w-32" />
        <TextLoader height="h2" className="w-24" />
        <div className="flex flex-wrap justify-between gap-3">
          <div className="h-12 w-32 rounded-sm bg-gray" />
          <div className="h-12 w-32 rounded-sm bg-gray" />
        </div>
        <div className="flex flex-wrap justify-between gap-3">
          <div className="h-12 w-32 rounded-sm bg-gray" />
          <div className="h-12 w-32 rounded-sm bg-gray" />
        </div>
      </div>
    </div>
  );
};
