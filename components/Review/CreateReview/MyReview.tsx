import { type FC, Suspense } from "react";

import { LargeComponentLoader } from "~/components/ui/Loaders/Loader";
import { getReview } from "~/lib/services/review";
import { getSessionUser } from "~/lib/services/session";

import { CreateReview } from "./CreateReview";
import { MyReviewLogin } from "./MyReviewLogin";

interface MyReviewProps {
  bookId: string;
}

export const MyReview: FC<MyReviewProps> = async ({ bookId }) => {
  const sessionUser = await getSessionUser();
  const reviewData = await getReview(sessionUser?.id, bookId);

  if (reviewData === undefined) return <MyReviewLogin />;

  return (
    <Suspense key={"CreateReview"} fallback={<LargeComponentLoader />}>
      <CreateReview bookId={bookId} reviewData={reviewData} />
    </Suspense>
  );
};
