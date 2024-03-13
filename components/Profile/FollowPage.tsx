import { type FC } from "react";

import { fetchProfilesCount } from "~/lib/actions/feed/profiles";

import { ProfilesFeed } from "../Feed/ProfilesFeed";
import { BackCategoryLink } from "../ui/BackCategoryLink";

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
  return (
    <>
      <BackCategoryLink href={`../${fullname}`} variant="RETURN" />
      <ProfilesFeed
        variant={variant}
        fullname={fullname}
        searchParams={searchParams}
        profilesCount={profilesCount}
      />
    </>
  );
};
