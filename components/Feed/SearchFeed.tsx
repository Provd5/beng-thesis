import { type FC } from "react";

import { fetchBooksInCategoryCount } from "~/lib/actions/feed/books";
import { fetchProfilesCount } from "~/lib/actions/feed/profiles";

import { EmptyQuery } from "../Search/EmptyQuery";
import { ItemsFound } from "../Search/ItemsFound";
import { BooksFeed } from "./BooksFeed";
import { ProfilesFeed } from "./ProfilesFeed";

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

  return !searchParams?.q ? (
    <EmptyQuery />
  ) : (
    <>
      {itemsFoundCount > 0 && (
        <ItemsFound itemsFound={itemsFoundCount.toString()} />
      )}
      {defaultCategory === "profiles" ? (
        <ProfilesFeed
          variant={null}
          fullname={null}
          searchParams={searchParams}
          profilesCount={itemsFoundCount}
        />
      ) : (
        <BooksFeed
          variant={null}
          fullname={null}
          searchParams={searchParams}
          booksCount={itemsFoundCount}
        />
      )}
    </>
  );
};
