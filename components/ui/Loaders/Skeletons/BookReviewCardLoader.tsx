import { type FC } from "react";

import { BookCover } from "~/components/Book/BookCover";

import { TextLoader } from "../Loader";

interface BookReviewCardLoaderProps {
  index: number;
}

export const BookReviewCardLoader: FC<BookReviewCardLoaderProps> = ({
  index,
}) => {
  return (
    <div
      className="animate-pulse"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex w-full gap-3">
        <BookCover isLoader />
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

export const BookReviewCardsLoader: FC<{ items: number }> = ({ items }) => {
  return Array.from({ length: items }, (_, i) => (
    <BookReviewCardLoader key={i} index={i} />
  ));
};
