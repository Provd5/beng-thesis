import type { FC } from "react";
import Link from "next/link";

import { type BookReviewCardInterface } from "~/types/BookCardDataInterface";

import { BookCover } from "../Book/BookCover";
import { TextLoader } from "../ui/Loader";
import { BookReviewCardDetails } from "./BookReviewCardDetails";

interface BookReviewCardProps {
  bookData: BookReviewCardInterface;
}

export const BookReviewCard: FC<BookReviewCardProps> = ({ bookData }) => {
  const myReview = bookData.book.review?.[0];
  const okReactions = myReview.review_reaction.filter(
    ({ reaction }) => reaction === "OK"
  );

  return (
    <div key={bookData.book.id}>
      <Link
        href={`/book/${bookData.book.id}/${bookData.book.title}`}
        className="float-left h-fit w-fit pr-3"
      >
        <BookCover coverUrl={bookData.book.thumbnail_url} />
      </Link>
      <div>
        <Link
          href={`/book/${bookData.book.id}/${bookData.book.title}`}
          className="self-start"
        >
          <h1 className="line-clamp-2">{bookData.book.title}</h1>
          <p className="text-sm text-black-light dark:text-white-dark">
            {bookData.book.authors.join(", ")}
          </p>
        </Link>
        {myReview && (
          <BookReviewCardDetails
            score={myReview.score}
            createdAt={myReview.created_at}
            updatedAt={myReview.updated_at}
            text={myReview.text}
            okReactions={okReactions.length}
          />
        )}
      </div>
    </div>
  );
};

export const BookReviewCardLoader: FC = () => {
  return (
    <div className="animate-pulse">
      <div className="flex w-full gap-3">
        <BookCover coverUrl={null} />
        <div className="flex w-full flex-col gap-1">
          <div className="flex flex-col gap-0.5">
            <TextLoader height="h1" className="w-32" />
            <TextLoader height="h2" className="w-24" />
          </div>
          <div className="flex flex-col gap-0.5">
            <TextLoader height="h1" className="w-28" />
            <TextLoader height="h3" className="w-36" />
          </div>
          <div className="flex flex-col gap-px">
            <TextLoader height="h1" className="w-11/12" />
            <TextLoader height="h1" className="w-10/12" />
            <TextLoader height="h1" className="w-9/12" />
          </div>
        </div>
      </div>
      <TextLoader height="h3" className="mt-1 w-44" />
    </div>
  );
};
