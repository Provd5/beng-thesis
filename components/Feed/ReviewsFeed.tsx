import { type FC } from "react";

import { fetchReviewReactions } from "~/lib/actions/book/fetch";
import { fetchReviews } from "~/lib/actions/feed/reviews";
import readUserSession from "~/lib/supabase/readUserSession";

import { ReviewCard } from "../Book/ReviewCard";

interface ReviewsFeedProps {
  bookId: string;
  searchParams:
    | {
        orderBy?: string;
        order?: "asc" | "desc";
        page?: string;
      }
    | undefined;
}

export const ReviewsFeed: FC<ReviewsFeedProps> = async ({
  bookId,
  searchParams,
}) => {
  const {
    data: { session },
  } = await readUserSession();

  const reviews = await fetchReviews(bookId, searchParams);
  const allReviewsReactions = await Promise.all(
    reviews.map(async (review) => ({
      [review.id]: await fetchReviewReactions(review.id),
    }))
  );

  return reviews.map((review) => {
    const isMyReview = review.profile.id === session?.user.id;
    const findThisReviewReactions = allReviewsReactions.find(
      (id) => Object.keys(id)[0] === review.id
    )?.[review.id];

    const reviewReactions = findThisReviewReactions
      ? findThisReviewReactions
      : {
          OK: 0,
          MEH: 0,
          myReaction: undefined,
        };

    return (
      <ReviewCard
        key={review.id}
        reviewData={review}
        isMyReview={isMyReview}
        reviewReactions={reviewReactions}
      />
    );
  });
};
