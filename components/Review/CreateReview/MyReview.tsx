import { type FC, Suspense } from "react";

import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";
import { getReview } from "~/lib/services/review";

import { CreateReview } from "./CreateReview";
import { MyReviewLogin } from "./MyReviewLogin";

interface MyReviewProps {
  bookId: string;
}

export const MyReview: FC<MyReviewProps> = async ({ bookId }) => {
  const reviewData = await getReview(bookId);

  if (reviewData === undefined) return <MyReviewLogin />;

  return (
    <Suspense fallback={<LargeComponentLoader />}>
      <CreateReview bookId={bookId} reviewData={reviewData} />
    </Suspense>
  );
};
