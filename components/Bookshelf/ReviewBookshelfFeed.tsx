import { type FC, Suspense } from "react";
import { type ReadonlyURLSearchParams } from "next/navigation";

import { SortReviewBookshelfArray } from "~/types/orderArrays";

import { BookshelfService } from "~/lib/services/bookshelf";

import { FeedSort } from "../Modals/FeedSort";
import { BookReviewCard } from "../Review/BookReviewCard/BookReviewCard";
import { BookReviewCardsLoader } from "../ui/Loaders/Skeletons/BookReviewCardLoader";

interface ReviewBookshelfFeedProps {
  profileName: string;
  searchParams: ReadonlyURLSearchParams;
}

export const ReviewBookshelfFeed: FC<ReviewBookshelfFeedProps> = async ({
  profileName,
  searchParams,
}) => {
  const bookshelfService = new BookshelfService();
  const reviews = await bookshelfService.getReviewBooks(
    profileName,
    searchParams
  );
  return (
    <>
      <FeedSort orderArray={SortReviewBookshelfArray} />
      <div className="grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-2">
        <Suspense
          fallback={<BookReviewCardsLoader items={reviews.itemsPerPage} />}
        >
          {reviews.data.map((review) => (
            <BookReviewCard key={review.id} reviewData={review} />
          ))}
        </Suspense>
      </div>
    </>
  );
};
