import { type FC } from "react";

import { type BookOwnedAsInterface } from "~/types/data/book";

import { AddOwnedAsForm } from "./AddOwnedAsForm";

interface ManageOwnedAsProps {
  bookId: string;
  ownedAsData: BookOwnedAsInterface | null | undefined;
}

export const ManageOwnedAs: FC<ManageOwnedAsProps> = ({
  bookId,
  ownedAsData,
}) => {
  if (ownedAsData === undefined) return;

  return (
    <AddOwnedAsForm
      key={`AddOwnedAsForm-${bookId}`}
      bookId={bookId}
      ownedAsData={ownedAsData}
    />
  );
};
