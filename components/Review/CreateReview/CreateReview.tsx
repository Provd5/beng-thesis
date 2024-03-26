import { type FC } from "react";

import { type ReviewInterface } from "~/types/data/review";

import { getSessionProfile } from "~/lib/services/profile";

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
  const profileData = await getSessionProfile();

  return (
    <div className="relative flex min-h-[350px] w-full flex-col gap-x-1 gap-y-2 py-3 sm:min-h-[260px] sm:flex-row">
      {profileData && <CreateReviewProfileDetails profileData={profileData} />}
      <CreateReviewForm bookId={bookId} reviewData={reviewData} />
    </div>
  );
};
