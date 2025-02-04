import type { FC } from "react";

import { getReview } from "~/lib/services/review/queries";
import { getSessionUser } from "~/lib/services/session/queries";

import { HandleSelectReview } from "./HandleSelectReview";

interface ManageReviewsProps {
  bookId: string;
  reviewsQuantity: number;
}

export const ManageReviews: FC<ManageReviewsProps> = async ({
  bookId,
  reviewsQuantity,
}) => {
  const sessionUser = await getSessionUser();
  const reviewData = await getReview(sessionUser?.id, bookId);

  return (
    <HandleSelectReview
      reviewData={reviewData}
      reviewsQuantity={reviewsQuantity}
    />
  );
};
