import { type FC } from "react";

import { SortReviewBookshelfArray } from "~/types/orderArrays";

import { getReviewBooks } from "~/lib/services/bookshelf";

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
  const reviews = await getReviewBooks(profileName, searchParams);

  return reviews.allItems === 0 ? (
    <NotFoundItems />
  ) : (
    <FeedSort
      currentPage={reviews.page}
      totalPages={reviews.totalPages}
      orderArray={SortReviewBookshelfArray}
    >
      <div className="grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-2">
        {reviews.data.map((review) => (
          <BookReviewCard key={review.review.id} reviewData={review} />
        ))}
      </div>
    </FeedSort>
  );
};
