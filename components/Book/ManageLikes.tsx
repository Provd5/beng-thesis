import type { FC } from "react";

import { BsBookmarkHeart, BsBookmarkHeartFill } from "react-icons/bs";

import { BookmarksWrapper } from "./BookmarksWrapper";

interface ManageLikesProps {
  liked: boolean;
  quantity: number;
}

export const ManageLikes: FC<ManageLikesProps> = ({ liked, quantity }) => {
  return (
    <div className="flex gap-1">
      {liked ? (
        <BookmarksWrapper Icon={BsBookmarkHeartFill} color="pink" />
      ) : (
        <BookmarksWrapper Icon={BsBookmarkHeart} color="gradient" />
      )}
      <div className="flex flex-col">
        <div className="flex h-[24px] items-center">
          <h3 className="bg-gradient-dark bg-clip-text text-base font-semibold text-transparent dark:bg-gradient-light">
            Likes
          </h3>
        </div>
        <p>{quantity}</p>
        <p className="text-xs text-black-light dark:text-white-dark">
          {liked ? "liked" : <span className="underline">like</span>}
        </p>
      </div>
    </div>
  );
};
