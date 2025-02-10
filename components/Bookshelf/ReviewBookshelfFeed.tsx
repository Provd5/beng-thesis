import { type FC } from "react";

import { SortReviewBookshelfArray } from "~/types/orderArrays";

import { getReviewBooks } from "~/lib/services/bookshelf/queries";
import { getSessionUser } from "~/lib/services/session/queries";

import { FeedSort } from "../Modals/FeedSort";
import { BookReviewCard } from "../Review/BookReviewCard/BookReviewCard";
import { NotFoundItems } from "../ui/NotFound/NotFoundItems";

interface ReviewBookshelfFeedProps {
  profileName: string;
  searchParams: unknown;
}

export const ReviewBookshelfFeed: FC<ReviewBookshelfFeedProps> = async ({
  profileName,
  searchParams,
}) => {
  const sessionUser = await getSessionUser();
  const { data: reviews, error } = await getReviewBooks(
    sessionUser?.id,
    profileName,
    searchParams,
  );

  if (error || !reviews) throw new Error(error);

  return reviews.allItems === 0 ? (
    <NotFoundItems />
  ) : (
    <FeedSort
      currentPage={reviews.page}
      totalPages={reviews.totalPages}
      orderArray={SortReviewBookshelfArray}
    >
      <div className="grid grid-cols-1 gap-y-2">
        {reviews.data.map((review) => (
          <BookReviewCard key={review.review.id} reviewData={review} />
        ))}
      </div>
    </FeedSort>
  );
};
