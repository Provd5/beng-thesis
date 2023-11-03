import { type OwnedAsType } from "~/types/CategoryTypes";

export const quantityPerOwnedType = (
  ownedAsVariant: OwnedAsType,
  bookOwnedAsArray:
    | {
        added_audiobook_at: Date | null;
        added_book_at: Date | null;
        added_ebook_at: Date | null;
      }[]
    | undefined
): number => {
  const getVariant = () => {
    switch (ownedAsVariant) {
      case "BOOK":
        return "added_book_at";
      case "EBOOK":
        return "added_ebook_at";
      case "AUDIOBOOK":
        return "added_audiobook_at";
    }
  };

  return (
    bookOwnedAsArray?.filter(
      (ownedAs) => ownedAs[getVariant()] && ownedAs[getVariant()] !== null
    ).length || 0
  );
};
