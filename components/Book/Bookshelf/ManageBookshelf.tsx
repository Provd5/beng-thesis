import { type FC } from "react";

import { type BookshelfInterface } from "~/types/data/bookshelf";

import { HandleChangeBookshlef } from "./HandleChangeBookshlef";

interface ManageBookshelfProps {
  bookId: string;
  bookshelfData: BookshelfInterface | null | undefined;
}

export const ManageBookshelf: FC<ManageBookshelfProps> = ({
  bookId,
  bookshelfData,
}) => {
  if (bookshelfData === undefined) return;

  return (
    <HandleChangeBookshlef bookId={bookId} bookshelfData={bookshelfData} />
  );
};
