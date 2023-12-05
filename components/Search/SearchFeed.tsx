import { type FC, Suspense } from "react";

import {
  booksOrderByArray,
  profilesOrderByArray,
} from "~/types/feed/OrderVariants";

import {
  fetchBooks,
  fetchBooksInCategoryCount,
} from "~/lib/actions/feed/books";
import { fetchProfiles, fetchProfilesCount } from "~/lib/actions/feed/profiles";

import { BooksFeed } from "../Feed/BooksFeed";
import { FeedSort } from "../Feed/FeedSort";
import { Pagination } from "../Feed/Pagination";
import { ProfilesFeed } from "../Feed/ProfilesFeed";
import { BookCardsLoader } from "../ui/Loaders/Skeletons/BookCardLoader";
import { ProfileCardsLoader } from "../ui/Loaders/Skeletons/ProfileCardLoader";
import { NotFoundItems } from "../ui/NotFoundItems";

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

  const itemsFound =
    defaultCategory === "profiles"
      ? await fetchProfiles(null, null, searchParams)
      : ((await fetchBooks(null, null, searchParams)) as BookInterface[]);

  const itemsFoundCount =
    defaultCategory === "profiles"
      ? await fetchProfilesCount(null, null, searchParams)
      : await fetchBooksInCategoryCount(null, null, searchParams);

  return (
    <>
      {itemsFoundCount > 0 && (
        <FeedSort
          orderArray={
            defaultCategory === "profiles"
              ? profilesOrderByArray
              : booksOrderByArray
          }
          searchParams={searchParams}
        />
      )}
      {itemsFoundCount === 0 ? (
        <NotFoundItems />
      ) : defaultCategory === "profiles" ? (
        <div className="grid grid-cols-1 justify-items-center gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={<ProfileCardsLoader items={itemsFound.length} />}>
            <ProfilesFeed
              variant={null}
              fullname={null}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-2">
          <Suspense fallback={<BookCardsLoader items={itemsFound.length} />}>
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
        takeLimit={itemsFound.length}
      />
    </>
  );
};
