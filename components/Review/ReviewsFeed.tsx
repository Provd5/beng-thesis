import { type FC, Suspense } from "react";
import { type ReadonlyURLSearchParams } from "next/navigation";
import { title } from "process";

import { SortReviewsArray } from "~/types/orderArrays";

import { ReviewService } from "~/lib/services/review";
import { sortParamsValidator } from "~/utils/sortParamsValidator";

import { BackCategoryLink } from "../Links/BackCategoryLink";
import { FeedSort } from "../Modals/FeedSort";
import { BookReviewCardsLoader } from "../ui/Loaders/Skeletons/BookReviewCardLoader";
import { ReviewCard } from "./ReviewCard/ReviewCard";

interface ReviewsFeedProps {
  bookId: string;
  searchParams: ReadonlyURLSearchParams;
}

export const ReviewsFeed: FC<ReviewsFeedProps> = async ({
  bookId,
  searchParams,
}) => {
  const reviewService = new ReviewService();
  const reviews = await reviewService.getAllReviews(bookId, searchParams);

  const validSearchParams = sortParamsValidator(searchParams, SortReviewsArray);

  return (
    <>
      <BackCategoryLink
        href={{ pathname: `../${title}`, query: validSearchParams }}
        variant="MY_REVIEW"
        replace
      />
      <FeedSort orderArray={SortReviewsArray} />
      <div className="grid grid-cols-1 gap-3">
        <Suspense
          fallback={<BookReviewCardsLoader items={reviews.itemsPerPage} />}
        >
          {reviews.data.map((review) => (
            <ReviewCard key={review.id} reviewData={review} />
          ))}
        </Suspense>
      </div>
    </>
  );
};
