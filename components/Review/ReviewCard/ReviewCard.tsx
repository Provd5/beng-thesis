import { type FC, Suspense } from "react";

import { type GetReviewInterface } from "~/types/data/review";

import { Loader } from "~/components/ui/Loaders/Loader";
import { Link } from "~/i18n/routing";
import { cn } from "~/utils/cn";
import ROUTES from "~/utils/routes";

import { ManageReaction } from "../Reactions/ManageReaction";
import { ReviewCardDetails } from "./ReviewCardDetails";
import { ReviewCardProfileDetails } from "./ReviewCardProfileDetails";
import { ReviewText } from "./ReviewText";

interface ReviewCardProps {
  reviewData: GetReviewInterface;
}

export const ReviewCard: FC<ReviewCardProps> = ({ reviewData }) => {
  if (!reviewData.profile) return;

  return (
    <div
      className={cn(
        "relative flex w-full flex-col gap-1 py-3 sm:flex-row",
        // isMyReview &&
        //   "min-h-[350px] before:pointer-events-none before:absolute before:inset-x-[-10px] before:inset-y-0 before:bg-yellow/10 before:dark:bg-yellow/5 sm:min-h-[260px] before:sm:rounded-md"
      )}
    >
      <Link
        href={
          reviewData.profile.full_name
            ? `${ROUTES.profile.root(reviewData.profile.full_name)}`
            : "#"
        }
        className="flex h-fit flex-none gap-x-1.5 gap-y-1 transition-transform hover:translate-x-1 sm:w-28 sm:flex-col sm:items-center"
      >
        <ReviewCardProfileDetails profileData={reviewData.profile} />
      </Link>
      <div className="flex w-full flex-col">
        <div>
          <ReviewCardDetails reviewData={reviewData} />
        </div>
        <div className="mt-1.5 flex h-full flex-wrap justify-between">
          {reviewData.text && (
            <>
              <ReviewText reviewText={reviewData.text} />
              <Suspense key={"ManageReaction"} fallback={<Loader />}>
                <ManageReaction
                  reviewId={reviewData.id}
                  reviewReaction={reviewData.review_reaction}
                />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
