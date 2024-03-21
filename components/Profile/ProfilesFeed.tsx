import { type FC, Suspense } from "react";
import { type ReadonlyURLSearchParams } from "next/navigation";

import { SortProfilesArray } from "~/types/orderArrays";

import { ProfileService } from "~/lib/services/profile";

import { FeedSort } from "../Modals/FeedSort";
import { ItemsFound } from "../Search/ItemsFound";
import { ProfileCardsLoader } from "../ui/Loaders/Skeletons/ProfileCardLoader";
import { ProfileCard } from "./ProfileCard";

interface ProfilesFeedProps {
  searchParams: ReadonlyURLSearchParams;
  q?: string;
}

export const ProfilesFeed: FC<ProfilesFeedProps> = async ({
  searchParams,
  q,
}) => {
  const profileService = new ProfileService();
  const profiles = await profileService.getAllProfiles(searchParams, q);

  return (
    <>
      {q && <ItemsFound itemsFound={profiles.allItems} />}
      <FeedSort orderArray={SortProfilesArray} />
      <div className="grid grid-cols-1 justify-items-center gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <Suspense
          fallback={<ProfileCardsLoader items={profiles.itemsPerPage} />}
        >
          {profiles.data.map((profile) => (
            <ProfileCard key={profile.id} profileData={profile} />
          ))}
        </Suspense>
      </div>
    </>
  );
};
