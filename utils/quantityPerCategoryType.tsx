import { type bookshelfType } from "@prisma/client";

import { type CategoryTypes } from "~/types/CategoryTypes";

export const quantityPerCategoryType = (
  categoryVariant: CategoryTypes,
  bookshelfArray: {
    bookshelf: bookshelfType | null;
  }[],
  quantities: {
    ownedQuantity?: number;
    likedQuantity?: number;
    reviewsQuantity?: number;
  }
): number => {
  const {
    ownedQuantity = 0,
    likedQuantity = 0,
    reviewsQuantity = 0,
  } = quantities;

  switch (categoryVariant) {
    case "OWNED":
      return ownedQuantity;
    case "LIKED":
      return likedQuantity;
    case "REVIEWS":
      return reviewsQuantity;
    default:
      return bookshelfArray.filter(
        (variant) => variant.bookshelf === categoryVariant
      ).length;
  }
};
