import { type FC, Suspense } from "react";
import { type ReadonlyURLSearchParams } from "next/navigation";

import { searchCategoryValidator } from "~/utils/searchCategoryValidator";

import { BooksFeed } from "../Book/BooksFeed";
import { ProfilesFeed } from "../Profile/ProfilesFeed";
import { LargeComponentLoader } from "../ui/Loaders/Loader";
import { EmptyQuery } from "./EmptyQuery";

interface SearchFeedProps {
  searchParams: ReadonlyURLSearchParams;
}

export const SearchFeed: FC<SearchFeedProps> = ({ searchParams }) => {
  const validSearchCategory = searchCategoryValidator(searchParams);

  if (validSearchCategory.q === "") return <EmptyQuery />;

  return (
    <>
      {validSearchCategory.category === "profiles" ? (
        <Suspense fallback={<LargeComponentLoader />}>
          <ProfilesFeed searchParams={searchParams} q={validSearchCategory.q} />
        </Suspense>
      ) : (
        <Suspense fallback={<LargeComponentLoader />}>
          <BooksFeed searchParams={searchParams} q={validSearchCategory.q} />
        </Suspense>
      )}
    </>
  );
};
