import { type FC } from "react";
import { type ReadonlyURLSearchParams } from "next/navigation";

import {
  SortBookshelvesArray,
  SortFollowProfilesArray,
} from "~/types/orderArrays";

import { NotFoundItems } from "~/components/ui/NotFound/NotFoundItems";
import { getFollowProfiles } from "~/lib/services/profile/queries";
import { getSessionUser } from "~/lib/services/session/queries";
import ROUTES from "~/utils/routes";
import { sortParamsValidator } from "~/utils/sortParamsValidator";

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
  const params = new URLSearchParams(searchParams as ReadonlyURLSearchParams);
  const from = params.get("from");

  const sessionUser = await getSessionUser();
  const { data: profiles, error } = await getFollowProfiles(
    sessionUser?.id,
    profileName,
    variant,
    searchParams,
  );

  if (error || !profiles) throw new Error(error);

  const validSearchParams = sortParamsValidator(
    searchParams,
    SortBookshelvesArray,
  );

  return (
    <>
      <BackCategoryLink
        href={{
          pathname: `${ROUTES.profile.root(profileName)}`,
          query: { from, ...validSearchParams },
        }}
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
