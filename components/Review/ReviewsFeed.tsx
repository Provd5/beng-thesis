import { type FC } from "react";
import { type ReadonlyURLSearchParams } from "next/navigation";
import { URLSearchParams } from "url";

import { SortReviewsArray } from "~/types/orderArrays";

import { getAllReviews } from "~/lib/services/review/queries";
import ROUTES from "~/utils/routes";
import { sortParamsValidator } from "~/utils/sortParamsValidator";

import { BackCategoryLink } from "../Links/BackCategoryLink";
import { FeedSort } from "../Modals/FeedSort";
import { NotFoundItems } from "../ui/NotFound/NotFoundItems";
import { ReviewCard } from "./ReviewCard/ReviewCard";

interface ReviewsFeedProps {
  bookTitle: string;
  bookId: string;
  searchParams: unknown;
}

export const ReviewsFeed: FC<ReviewsFeedProps> = async ({
  bookTitle,
  bookId,
  searchParams,
}) => {
  const params = new URLSearchParams(searchParams as ReadonlyURLSearchParams);
  const from = params.get("from");
  const { data: reviews, error } = await getAllReviews(bookId, searchParams);

  if (error || !reviews) throw new Error(error);

  const validSearchParams = sortParamsValidator(searchParams, SortReviewsArray);

  return (
    <>
      <BackCategoryLink
        href={{
          pathname: ROUTES.book.back(bookTitle),
          query: { from, ...validSearchParams },
        }}
        variant="MY_REVIEW"
        replace
      />
      {reviews.allItems === 0 ? (
        <NotFoundItems itemType="reviews" />
      ) : (
        <FeedSort
          currentPage={reviews.page}
          totalPages={reviews.totalPages}
          orderArray={SortReviewsArray}
        >
          <div className="grid grid-cols-1 gap-3">
            {reviews.data.map((review) => (
              <ReviewCard key={review.id} reviewData={review} />
            ))}
          </div>
        </FeedSort>
      )}
    </>
  );
};
