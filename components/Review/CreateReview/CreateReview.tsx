import { type FC } from "react";

import { type ReviewInterface } from "~/types/data/review";

import {
  getSessionUser,
  getSessionUserDetails,
} from "~/lib/services/session/queries";

import { CreateReviewForm } from "./CreateReviewForm";
import { CreateReviewProfileDetails } from "./CreateReviewProfileDetails";

interface CreateReviewProps {
  bookId: string;
  reviewData: ReviewInterface | null;
}

export const CreateReview: FC<CreateReviewProps> = async ({
  bookId,
  reviewData,
}) => {
  const sessionUser = await getSessionUser();
  const userDetails = await getSessionUserDetails(sessionUser?.id);

  return (
    <div className="relative flex min-h-[350px] w-full flex-col gap-x-1 gap-y-2 py-3 sm:min-h-[260px] sm:flex-row">
      {userDetails && <CreateReviewProfileDetails profileData={userDetails} />}
      <CreateReviewForm bookId={bookId} reviewData={reviewData} />
    </div>
  );
};
