import { type FC } from "react";

import { type LikedBookInterface } from "~/types/data/book";

import { LikeBookForm } from "./LikeBookForm";

interface ManageLikesProps {
  bookId: string;
  likeData: LikedBookInterface | null | undefined;
  likesQuantity: number;
}

export const ManageLikes: FC<ManageLikesProps> = ({
  bookId,
  likeData,
  likesQuantity,
}) => {
  return (
    <LikeBookForm
      bookId={bookId}
      likeData={likeData}
      likesQuantity={likesQuantity}
    />
  );
};
