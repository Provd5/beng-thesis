import type { FC } from "react";

import { HandleSelectReview } from "./HandleSelectReview";

interface ManageReviewsProps {
  reviewsQuantity: number;
  reviewData: { rate: number; created_at: Date } | null | undefined;
}

export const ManageReviews: FC<ManageReviewsProps> = async ({
  reviewsQuantity,
  reviewData,
}) => {
  return (
    <HandleSelectReview
      reviewData={reviewData}
      reviewsQuantity={reviewsQuantity}
    />
  );
};
