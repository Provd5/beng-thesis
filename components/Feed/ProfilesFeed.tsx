import { type FC } from "react";

import { fetchProfiles } from "~/lib/actions/feed/profiles";
import readUserSession from "~/lib/supabase/readUserSession";

import { ProfileCard } from "../Explore/ProfileCard";

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
}

export const ProfilesFeed: FC<ProfilesFeedProps> = async ({
  variant,
  fullname,
  searchParams,
}) => {
  const {
    data: { session },
  } = await readUserSession();

  const profiles = await fetchProfiles(variant, fullname, searchParams);

  return profiles.map((profile) => {
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
  });
};
