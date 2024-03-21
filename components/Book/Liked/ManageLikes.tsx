import { type FC } from "react";

import { BookService } from "~/lib/services/book";

import { LikeBookForm } from "./LikeBookForm";

interface ManageLikesProps {
  bookId: string;
  likesQuantity: number;
}

export const ManageLikes: FC<ManageLikesProps> = async ({
  bookId,
  likesQuantity,
}) => {
  const bookService = new BookService();
  const likeData = await bookService.getLikedData(bookId);

  return (
    <LikeBookForm
      bookId={bookId}
      likeData={likeData}
      likesQuantity={likesQuantity}
    />
  );
};
