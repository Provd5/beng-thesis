import type { FC } from "react";

import { BsBookmarkStar, BsBookmarkStarFill } from "react-icons/bs";

import { dateFormater } from "~/utils/dateFormater";

import { BookmarksWrapper } from "./BookmarksWrapper";

interface ManageReviewsProps {
  myReview: boolean;
  quantity: number;
  createdAt?: Date;
}

export const ManageReviews: FC<ManageReviewsProps> = ({
  myReview,
  quantity,
  createdAt,
}) => {
  return (
    <div className="flex gap-1">
      {myReview ? (
        <BookmarksWrapper Icon={BsBookmarkStarFill} color="yellow" />
      ) : (
        <BookmarksWrapper Icon={BsBookmarkStar} color="gradient" />
      )}
      <div className="flex flex-col">
        <div className="flex h-[24px] items-center">
          <h3 className="bg-gradient-dark bg-clip-text text-base font-semibold text-transparent dark:bg-gradient-light">
            Reviews
          </h3>
        </div>
        <p>{quantity}</p>
        <p className="text-xs text-black-light dark:text-white-dark">
          {createdAt ? (
            dateFormater(createdAt)
          ) : (
            <span className="underline">write yours</span>
          )}
        </p>
      </div>
    </div>
  );
};
