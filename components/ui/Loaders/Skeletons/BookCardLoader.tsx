import type { FC } from "react";

import { BookCover } from "~/components/Book/BookCover";

import { TextLoader } from "../Loader";

export const BookCardLoader: FC = ({}) => {
  return (
    <div className="flex animate-pulse justify-center gap-3 md:justify-start">
      <BookCover coverUrl={null} />
      <div className="flex w-full max-w-[300px] flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <TextLoader height="h1" className="w-32" />
          <TextLoader height="h2" className="w-24" />
        </div>
        <div className="flex flex-wrap justify-between gap-3">
          <div className="h-11 w-32 rounded-sm bg-gray" />
          <div className="h-11 w-32 rounded-sm bg-gray" />
        </div>
        <div className="flex flex-wrap justify-between gap-3">
          <div className="h-14 w-32 rounded-sm bg-gray" />
          <div className="h-14 w-32 rounded-sm bg-gray" />
        </div>
      </div>
    </div>
  );
};
