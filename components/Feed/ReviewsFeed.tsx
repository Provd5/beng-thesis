import { type FC, Suspense } from "react";

import { reviewsOrderByArray } from "~/types/feed/OrderVariants";
import { REVIEWS_FEED_TAKE_LIMIT } from "~/types/feed/TakeLimits";

import { fetchReviewReactions } from "~/lib/actions/book/fetch";
import { fetchReviews } from "~/lib/actions/feed/reviews";
import readUserSession from "~/lib/supabase/readUserSession";

import { ReviewCard } from "../Book/ReviewCard";
import { BookReviewCardsLoader } from "../ui/Loaders/Skeletons/BookReviewCardLoader";
import { NotFoundItems } from "../ui/NotFoundItems";
import { FeedSort } from "./FeedSort";
import { Pagination } from "./Pagination";

interface ReviewsFeedProps {
  bookId: string;
  searchParams:
    | {
        orderBy?: string;
        order?: "asc" | "desc";
        page?: string;
      }
    | undefined;
  reviewsCount: number;
}

export const ReviewsFeed: FC<ReviewsFeedProps> = async ({
  bookId,
  searchParams,
  reviewsCount,
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

  const maxTakeLimit =
    reviewsCount < REVIEWS_FEED_TAKE_LIMIT
      ? reviewsCount
      : REVIEWS_FEED_TAKE_LIMIT;

  return (
    <>
      <FeedSort orderArray={reviewsOrderByArray} searchParams={searchParams} />
      {!(reviewsCount > 0) ? (
        <NotFoundItems itemType="reviews" />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          <Suspense fallback={<BookReviewCardsLoader items={maxTakeLimit} />}>
            {reviews.map((review) => {
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
            })}
          </Suspense>
        </div>
      )}
      <Pagination
        searchParams={searchParams}
        totalItems={reviewsCount}
        takeLimit={maxTakeLimit}
      />
    </>
  );
};
