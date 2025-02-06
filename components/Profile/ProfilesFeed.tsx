import { type FC } from "react";

import { SortProfilesArray } from "~/types/orderArrays";

import { getAllProfiles } from "~/lib/services/profile/queries";
import { getSessionUser } from "~/lib/services/session/queries";

import { FeedSort } from "../Modals/FeedSort";
import { ItemsFound } from "../Search/ItemsFound";
import { NotFoundItems } from "../ui/NotFound/NotFoundItems";
import { ProfileCard } from "./ProfileCard/ProfileCard";

interface ProfilesFeedProps {
  searchParams: unknown;
  q?: string;
}

export const ProfilesFeed: FC<ProfilesFeedProps> = async ({
  searchParams,
  q,
}) => {
  const sessionUser = await getSessionUser();
  const profiles = await getAllProfiles(sessionUser?.id, searchParams, q);

  return (
    <>
      {q && <ItemsFound itemsFound={profiles.allItems} />}

      {profiles.allItems === 0 ? (
        <NotFoundItems />
      ) : (
        <FeedSort
          currentPage={profiles.page}
          totalPages={profiles.totalPages}
          orderArray={SortProfilesArray}
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
