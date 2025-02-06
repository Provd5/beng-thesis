import { type FC } from "react";

import { SortFollowProfilesArray } from "~/types/orderArrays";

import { NotFoundItems } from "~/components/ui/NotFound/NotFoundItems";
import { getFollowProfiles } from "~/lib/services/profile/queries";
import { getSessionUser } from "~/lib/services/session/queries";
import ROUTES from "~/utils/routes";

import { BackCategoryLink } from "../../Links/BackCategoryLink";
import { FeedSort } from "../../Modals/FeedSort";
import { ProfileCard } from "../ProfileCard/ProfileCard";

interface FollowPageProps {
  profileName: string;
  variant: "follower" | "following";
  searchParams: unknown;
}

export const FollowPage: FC<FollowPageProps> = async ({
  profileName,
  variant,
  searchParams,
}) => {
  const sessionUser = await getSessionUser();
  const profiles = await getFollowProfiles(
    sessionUser?.id,
    profileName,
    variant,
    searchParams,
  );

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
