import { type FC, Suspense } from "react";

import {
  booksOrderByArray,
  profilesOrderByArray,
} from "~/types/feed/OrderVariants";
import {
  BOOKS_FEED_TAKE_LIMIT,
  PROFILES_FEED_TAKE_LIMIT,
} from "~/types/feed/TakeLimits";

import { fetchBooksInCategoryCount } from "~/lib/actions/feed/books";
import { fetchProfilesCount } from "~/lib/actions/feed/profiles";

import { BooksFeed } from "../Feed/BooksFeed";
import { FeedSort } from "../Feed/FeedSort";
import { Pagination } from "../Feed/Pagination";
import { ProfilesFeed } from "../Feed/ProfilesFeed";
import { BookCardsLoader } from "../ui/Loaders/Skeletons/BookCardLoader";
import { ProfileCardsLoader } from "../ui/Loaders/Skeletons/ProfileCardLoader";
import { NotFoundItems } from "../ui/NotFoundItems";
import { ItemsFound } from "./ItemsFound";

interface SearchFeedProps {
  searchParams:
    | {
        orderBy?: string;
        order?: "asc" | "desc";
        page?: string;
        q?: string;
        category?: "books" | "profiles";
      }
    | undefined;
}

export const SearchFeed: FC<SearchFeedProps> = async ({ searchParams }) => {
  const defaultCategory = searchParams?.category
    ? searchParams.category
    : "books";

  const itemsFoundCount =
    defaultCategory === "profiles"
      ? await fetchProfilesCount(null, null, searchParams)
      : await fetchBooksInCategoryCount(null, null, searchParams);

  const maxTakeLimit = Math.min(
    itemsFoundCount,
    defaultCategory === "profiles"
      ? PROFILES_FEED_TAKE_LIMIT
      : BOOKS_FEED_TAKE_LIMIT
  );

  return (
    <>
      {itemsFoundCount > 0 && (
        <div className="flex flex-auto justify-between gap-1">
          <ItemsFound itemsFound={itemsFoundCount.toString()} />
          <FeedSort
            orderArray={
              defaultCategory === "profiles"
                ? profilesOrderByArray
                : booksOrderByArray
            }
            searchParams={searchParams}
          />
        </div>
      )}
      {itemsFoundCount === 0 ? (
        <NotFoundItems />
      ) : defaultCategory === "profiles" ? (
        <div className="grid grid-cols-1 justify-items-center gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={<ProfileCardsLoader items={maxTakeLimit} />}>
            <ProfilesFeed
              variant={null}
              fullname={null}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-2">
          <Suspense fallback={<BookCardsLoader items={maxTakeLimit} />}>
            <BooksFeed
              variant={null}
              fullname={null}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      )}
      <Pagination
        searchParams={searchParams}
        totalItems={itemsFoundCount}
        takeLimit={maxTakeLimit}
      />
    </>
  );
};
