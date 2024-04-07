import { type FC, Suspense } from "react";

import { searchCategoryValidator } from "~/utils/searchCategoryValidator";

import { BooksFeed } from "../Book/BooksFeed";
import { ProfilesFeed } from "../Profile/ProfilesFeed";
import { LargeComponentLoader } from "../ui/Loaders/Loader";
import { EmptyQuery } from "./EmptyQuery";

interface SearchFeedProps {
  searchParams: unknown;
}

export const SearchFeed: FC<SearchFeedProps> = ({ searchParams }) => {
  const validSearchCategory = searchCategoryValidator(searchParams);

  if (validSearchCategory.q === "") return <EmptyQuery />;

  return (
    <>
      {validSearchCategory.category === "profiles" ? (
        <Suspense
          key={"SearchFeed-ProfilesFeed"}
          fallback={<LargeComponentLoader />}
        >
          <ProfilesFeed searchParams={searchParams} q={validSearchCategory.q} />
        </Suspense>
      ) : (
        <Suspense
          key={"SearchFeed-BooksFeed"}
          fallback={<LargeComponentLoader />}
        >
          <BooksFeed searchParams={searchParams} q={validSearchCategory.q} />
        </Suspense>
      )}
    </>
  );
};
