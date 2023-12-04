import { type FC, Suspense } from "react";

import { profilesOrderByArray } from "~/types/feed/OrderVariants";
import { PROFILES_FEED_TAKE_LIMIT } from "~/types/feed/TakeLimits";

import { fetchProfilesCount } from "~/lib/actions/feed/profiles";

import { FeedSort } from "../Feed/FeedSort";
import { Pagination } from "../Feed/Pagination";
import { ProfilesFeed } from "../Feed/ProfilesFeed";
import { BackCategoryLink } from "../ui/BackCategoryLink";
import { ProfileCardsLoader } from "../ui/Loaders/Skeletons/ProfileCardLoader";
import { NotFoundItems } from "../ui/NotFoundItems";

interface FollowPageProps {
  fullname: string;
  variant: "followers" | "following";
  searchParams:
    | {
        orderBy?: string;
        order?: "asc" | "desc";
        page?: string;
      }
    | undefined;
}

export const FollowPage: FC<FollowPageProps> = async ({
  fullname,
  variant,
  searchParams,
}) => {
  const profilesCount = await fetchProfilesCount(variant, fullname);
  const maxTakeLimit =
    profilesCount < PROFILES_FEED_TAKE_LIMIT
      ? profilesCount
      : PROFILES_FEED_TAKE_LIMIT;

  return (
    <>
      <BackCategoryLink href={`../${fullname}`} variant="RETURN" />
      <FeedSort orderArray={profilesOrderByArray} searchParams={searchParams} />
      {!(profilesCount > 0) ? (
        <NotFoundItems />
      ) : (
        <div className="grid grid-cols-1 justify-items-center gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={<ProfileCardsLoader items={maxTakeLimit} />}>
            <ProfilesFeed
              variant={variant}
              fullname={fullname}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      )}
      <Pagination
        searchParams={searchParams}
        totalItems={profilesCount}
        takeLimit={maxTakeLimit}
      />
    </>
  );
};
