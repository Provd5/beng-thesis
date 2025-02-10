import { type FC } from "react";

import { type ReviewInterface } from "~/types/data/review";

import { getProfile } from "~/lib/services/profile/queries";
import { getSessionUser } from "~/lib/services/session/queries";

import { ReviewCardProfileDetails } from "../ReviewCard/ReviewCardProfileDetails";
import { CreateReviewForm } from "./CreateReviewForm";
import { DeleteReviewForm } from "./DeleteReviewForm";

interface CreateReviewProps {
  bookId: string;
  reviewData: ReviewInterface | null;
}

export const CreateReview: FC<CreateReviewProps> = async ({
  bookId,
  reviewData,
}) => {
  const sessionUser = await getSessionUser();
  const { data: sessionProfile } = await getProfile(sessionUser?.id);

  return (
    <div className="flex min-h-[350px] w-full flex-col gap-x-1 gap-y-2 py-3 sm:min-h-[260px] sm:flex-row">
      <div className="flex items-end justify-between sm:flex-col">
        <div className="flex h-fit max-w-[70vw] flex-none gap-x-1.5 gap-y-1 sm:w-28 sm:flex-col sm:items-center">
          {sessionProfile && (
            <ReviewCardProfileDetails profileData={sessionProfile} />
          )}
        </div>
        <div className="relative">
          {reviewData && <DeleteReviewForm reviewId={reviewData.id} />}
        </div>
      </div>
      <CreateReviewForm bookId={bookId} reviewData={reviewData} />
    </div>
  );
};
