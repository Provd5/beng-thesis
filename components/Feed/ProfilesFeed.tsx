import { type FC, Suspense } from "react";

import { profilesOrderByArray } from "~/types/feed/OrderVariants";
import { PROFILES_FEED_TAKE_LIMIT } from "~/types/feed/TakeLimits";

import { fetchProfiles } from "~/lib/actions/feed/profiles";
import readUserSession from "~/lib/supabase/readUserSession";

import { ProfileCard } from "../Explore/ProfileCard";
import { ProfileCardsLoader } from "../ui/Loaders/Skeletons/ProfileCardLoader";
import { NotFoundItems } from "../ui/NotFoundItems";
import { FeedSort } from "./FeedSort";
import { Pagination } from "./Pagination";

interface ProfilesFeedProps {
  variant: "followers" | "following" | null;
  fullname: string | null;
  searchParams:
    | {
        orderBy?: string;
        order?: "asc" | "desc";
        page?: string;
      }
    | undefined;
  profilesCount: number;
}

export const ProfilesFeed: FC<ProfilesFeedProps> = async ({
  variant,
  fullname,
  searchParams,
  profilesCount,
}) => {
  const {
    data: { session },
  } = await readUserSession();

  const profiles = await fetchProfiles(variant, fullname, searchParams);
  const maxTakeLimit =
    profilesCount < PROFILES_FEED_TAKE_LIMIT
      ? profilesCount
      : PROFILES_FEED_TAKE_LIMIT;

  return profilesCount === 0 ? (
    <NotFoundItems />
  ) : (
    <>
      <FeedSort orderArray={profilesOrderByArray} searchParams={searchParams} />
      <div className="grid grid-cols-1 justify-items-center gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<ProfileCardsLoader items={maxTakeLimit} />}>
          {profiles.map((profile) => {
            const isFollowed = profile.followed_by?.some(
              (follower) => follower.follower_id === session?.user.id
            );
            const isMyProfile = profile.id === session?.user.id;

            return (
              <ProfileCard
                key={profile.id}
                profileData={profile}
                isFollowed={isFollowed}
                isSession={!!session?.user.id}
                isMyProfile={isMyProfile}
              />
            );
          })}
        </Suspense>
      </div>
      <Pagination
        searchParams={searchParams}
        totalItems={profilesCount}
        takeLimit={maxTakeLimit}
      />
    </>
  );
};
