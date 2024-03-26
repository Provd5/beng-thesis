import { type FC } from "react";
import { type ReadonlyURLSearchParams } from "next/navigation";

import { SortFollowProfilesArray } from "~/types/orderArrays";

import { NotFoundItems } from "~/components/ui/NotFound/NotFoundItems";
import { getFollowProfiles } from "~/lib/services/profile";
import ROUTES from "~/utils/routes";

import { BackCategoryLink } from "../../Links/BackCategoryLink";
import { FeedSort } from "../../Modals/FeedSort";
import { ProfileCard } from "../ProfileCard/ProfileCard";

interface FollowPageProps {
  profileName: string;
  variant: "follower" | "following";
  searchParams: ReadonlyURLSearchParams;
}

export const FollowPage: FC<FollowPageProps> = async ({
  profileName,
  variant,
  searchParams,
}) => {
  const profiles = await getFollowProfiles(profileName, variant, searchParams);

  return (
    <>
      <BackCategoryLink
        href={`${ROUTES.profile.root(profileName)}`}
        variant="RETURN"
      />

      {profiles.allItems === 0 ? (
        <NotFoundItems />
      ) : (
        <FeedSort
          currentPage={profiles.page}
          totalPages={profiles.totalPages}
          orderArray={SortFollowProfilesArray}
        >
          <div className="grid grid-cols-1 justify-items-center gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.data.map((profile) => (
              <ProfileCard key={profile.id} profileData={profile} />
            ))}
          </div>
        </FeedSort>
      )}
    </>
  );
};
