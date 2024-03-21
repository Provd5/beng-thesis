import { type FC, Suspense } from "react";

import { Loader } from "~/components/ui/Loaders/Loader";
import { ReviewService } from "~/lib/services/review";

import { CreateReview } from "./CreateReview";
import { MyReviewLogin } from "./MyReviewLogin";

interface MyReviewProps {
  bookId: string;
}

export const MyReview: FC<MyReviewProps> = async ({ bookId }) => {
  const reviewService = new ReviewService();
  const reviewData = await reviewService.getReview(bookId);

  if (reviewData === undefined) return <MyReviewLogin />;

  return (
    <Suspense fallback={<Loader />}>
      <CreateReview reviewData={reviewData} />
    </Suspense>
  );
};
