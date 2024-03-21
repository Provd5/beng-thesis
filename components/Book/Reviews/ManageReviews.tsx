import type { FC } from "react";

import { ReviewService } from "~/lib/services/review";

import { HandleSelectReview } from "./HandleSelectReview";

interface ManageReviewsProps {
  bookId: string;
}

export const ManageReviews: FC<ManageReviewsProps> = async ({ bookId }) => {
  const reviewService = new ReviewService();
  const [reviewData, reviewsQuantity] = await Promise.all([
    reviewService.getReview(bookId),
    reviewService.getQuantity(bookId),
  ]);

  return (
    <HandleSelectReview
      reviewData={reviewData}
      reviewsQuantity={reviewsQuantity}
    />
  );
};
