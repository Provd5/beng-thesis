import { type FC } from "react";
import Link from "next/link";
import clsx from "clsx";

import { type ReviewInterface } from "~/types/data/review";

import { ProfileService } from "~/lib/services/profile";
import ROUTES from "~/utils/routes";

import { ManageReaction } from "../Reactions/ManageReaction";
import { ReactionsLabel } from "../Reactions/ReactionsLabel";
import { ReviewCardDetails } from "./ReviewCardDetails";
import { ReviewCardProfileDetails } from "./ReviewCardProfileDetails";
import { ReviewText } from "./ReviewText";

interface ReviewCardProps {
  reviewData: ReviewInterface;
}

export const ReviewCard: FC<ReviewCardProps> = async ({ reviewData }) => {
  const profileService = new ProfileService();
  const profileData = await profileService.getProfileFromId(
    reviewData.author_id
  );

  return (
    <div
      className={clsx(
        "relative flex w-full flex-col gap-1 py-3 sm:flex-row"
        // isMyReview &&
        //   "min-h-[350px] before:pointer-events-none before:absolute before:inset-x-[-10px] before:inset-y-0 before:bg-yellow/10 before:dark:bg-yellow/5 sm:min-h-[260px] before:sm:rounded-md"
      )}
    >
      <Link
        href={
          profileData.full_name
            ? ROUTES.profile.root(profileData.full_name)
            : "#"
        }
        className="flex h-fit flex-none gap-x-1.5 gap-y-1 sm:w-24 sm:flex-col sm:items-center"
      >
        <ReviewCardProfileDetails
          avatarUrl={profileData.avatar_url}
          profileName={profileData.full_name}
          createdAt={profileData.created_at}
          bookshelfQuantity={profileData._count.bookshelf}
          reviewQuantity={profileData._count.review}
        />
      </Link>
      <div className="flex w-full flex-auto flex-col justify-between">
        <div>
          <ReviewCardDetails
            createdAt={reviewData.created_at}
            updatedAt={reviewData.updated_at}
            rate={reviewData.rate}
            likedBooksQuantity={profileData._count.liked_book}
          />
        </div>
        <div className="mt-1.5 flex flex-wrap justify-between">
          {reviewData.text && (
            <>
              <ReviewText reviewText={reviewData.text} />
              <ReactionsLabel />
              <ManageReaction reviewId={reviewData.id} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
