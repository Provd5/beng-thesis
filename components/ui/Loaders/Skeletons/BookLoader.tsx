import type { FC } from "react";

import { BookCover } from "~/components/Book/BookCover";

import { TextLoader } from "../Loader";

export const BookLoader: FC = ({}) => {
  return (
    <div className="mt-3 flex-col">
      <div className="flex flex-col gap-x-10 gap-y-8 px-1 xs:px-3 md:flex-row md:justify-between md:px-6">
        <div className="flex gap-3">
          <div className="flex h-fit w-fit animate-pulse">
            <BookCover size="lg" isLoader />
          </div>

          <div
            className="mt-0.5 flex animate-pulse flex-col gap-3"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex flex-col gap-1">
              <TextLoader height="h1" className="w-36" />
              <TextLoader height="h2" className="w-24" />
            </div>
            <div className="flex flex-col gap-1">
              <TextLoader height="h2" className="w-32" />
              <TextLoader height="h2" className="w-28" />
            </div>
            <div className="flex flex-col gap-1">
              <TextLoader height="h2" className="w-40" />
              <TextLoader height="h2" className="w-36" />
            </div>
            <div className="flex flex-col gap-1">
              <TextLoader height="h1" className="w-32" />
              <div className="h-7 w-12 rounded bg-gray" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-1 gap-y-4 xs:gap-8 xs:px-2 md:justify-end">
          <div
            className="flex h-fit animate-pulse flex-col items-start justify-center gap-4 xs:gap-8"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="h-12 w-36 rounded-md bg-gray" />
            <div className="h-12 w-36 rounded-md bg-gray" />
          </div>
          <div
            className="flex h-fit animate-pulse flex-col items-start justify-center gap-4 xs:gap-8"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="h-12 w-36 rounded-md bg-gray" />
            <div className="h-12 w-36 rounded-md bg-gray" />
          </div>
        </div>
      </div>
      <div
        className="mt-8 flex animate-pulse flex-col gap-1"
        style={{ animationDelay: "0.8s" }}
      >
        <TextLoader height="h1" className="w-12" />
        <div className="ml-0.5 flex flex-col gap-px">
          <TextLoader height="h3" className="w-11/12" />
          <TextLoader height="h3" className="w-10/12" />
          <TextLoader height="h3" className="w-9/12" />
        </div>
      </div>
    </div>
  );
};
