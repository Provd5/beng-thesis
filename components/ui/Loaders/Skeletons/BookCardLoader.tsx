import type { FC } from "react";

import { BookCover } from "~/components/Book/BookCover";

import { TextLoader } from "../Loader";

interface BookCardLoaderProps {
  index: number;
}

export const BookCardLoader: FC<BookCardLoaderProps> = ({ index }) => {
  return (
    <div
      className="flex animate-pulse justify-center gap-3 md:justify-start"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <BookCover isLoader />
      <div className="flex w-full max-w-[300px] flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <TextLoader height="h1" className="w-32" />
          <TextLoader height="h2" className="w-24" />
        </div>
        <div className="flex flex-wrap justify-between gap-x-3 gap-y-2">
          <div className="h-11 w-[120px] rounded-sm bg-gray" />
          <div className="h-11 w-[120px] rounded-sm bg-gray" />
        </div>
        <div className="flex flex-wrap justify-between gap-x-3 gap-y-2">
          <div className="h-14 w-[120px] rounded-sm bg-gray" />
          <div className="h-14 w-[120px] rounded-sm bg-gray" />
        </div>
      </div>
    </div>
  );
};
