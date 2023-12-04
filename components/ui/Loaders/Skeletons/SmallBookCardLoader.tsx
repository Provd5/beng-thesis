import { type FC } from "react";

import { BookCover } from "~/components/Book/BookCover";

import { TextLoader } from "../Loader";

interface SmallBookCardLoaderProps {
  index: number;
}

export const SmallBookCardLoader: FC<SmallBookCardLoaderProps> = ({
  index,
}) => {
  return (
    <div
      className="flex w-32 flex-none animate-pulse snap-center flex-col items-center gap-1 py-0.5 md:snap-start"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <BookCover isLoader />
      <div className="flex w-full flex-col gap-0.5">
        <TextLoader height="h1" className="w-full" />
        <TextLoader height="h1" className="w-3/4" />
      </div>
    </div>
  );
};

export const SmallBookCardsLoader: FC<{ items: number }> = ({ items }) => {
  return Array.from({ length: items }, (_, i) => (
    <SmallBookCardLoader key={i} index={i} />
  ));
};
