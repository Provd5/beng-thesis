import type { FC } from "react";

import { getReview } from "~/lib/services/review";

import { HandleSelectReview } from "./HandleSelectReview";

interface ManageReviewsProps {
  bookId: string;
  reviewsQuantity: number;
}

export const ManageReviews: FC<ManageReviewsProps> = async ({
  bookId,
  reviewsQuantity,
}) => {
  const reviewData = await getReview(bookId);

  return (
    <HandleSelectReview
      reviewData={reviewData}
      reviewsQuantity={reviewsQuantity}
    />
  );
};
