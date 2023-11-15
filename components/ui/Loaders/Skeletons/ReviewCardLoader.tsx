import type { FC } from "react";
import clsx from "clsx";

import { AvatarImage } from "~/components/Profile/AvatarImage";

import { TextLoader } from "../Loader";

interface ReviewCardLoaderProps {
  isMyReview?: boolean;
  index: number;
}

export const ReviewCardLoader: FC<ReviewCardLoaderProps> = ({
  isMyReview,
  index,
}) => {
  return (
    <div
      className={clsx(
        "relative flex w-full animate-pulse flex-col gap-1 py-3 sm:flex-row",
        isMyReview &&
          "min-h-[350px] before:pointer-events-none before:absolute before:inset-x-[-10px] before:inset-y-0 before:bg-yellow/10 before:dark:bg-yellow/5 sm:min-h-[260px] before:sm:rounded-md"
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex h-fit flex-none gap-x-1.5 gap-y-1 sm:w-24 sm:flex-col sm:items-center">
        <AvatarImage isLoader className="drop-shadow-icon" />
        <div className="flex w-full flex-col items-start gap-0.5 sm:items-center">
          <TextLoader height="h1" className="w-36 sm:w-full" />
          <TextLoader height="h2" className="w-40 sm:w-10/12" />
          <div className="mt-1 flex gap-2">
            <div className="h-6 w-8 rounded bg-gray" />
            <div className="h-6 w-8 rounded bg-gray" />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-auto flex-col justify-between gap-3">
        <div className="flex flex-col">
          <TextLoader height="h3" className="w-44" />
          <TextLoader height="h1" className="my-2 w-40" />
          <div className="flex flex-col gap-px">
            <TextLoader height="h1" className="w-12/12" />
            <TextLoader height="h1" className="w-11/12" />
            <TextLoader height="h1" className="w-10/12" />
            <TextLoader height="h1" className="w-12/12" />
            <TextLoader height="h1" className="w-11/12" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 self-end">
          <TextLoader height="h3" className="w-44" />
          <div className="flex gap-1">
            <div className="h-8 w-14 rounded-sm bg-gray" />
            <div className="h-8 w-14 rounded-sm bg-gray" />
          </div>
        </div>
      </div>
    </div>
  );
};
