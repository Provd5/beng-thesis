import { type FC, Suspense } from "react";
import { type ReadonlyURLSearchParams } from "next/navigation";

import { SortFollowProfilesArray } from "~/types/orderArrays";

import { ProfileService } from "~/lib/services/profile";
import ROUTES from "~/utils/routes";

import { BackCategoryLink } from "../../Links/BackCategoryLink";
import { FeedSort } from "../../Modals/FeedSort";
import { ProfileCardsLoader } from "../../ui/Loaders/Skeletons/ProfileCardLoader";
import { ProfileCard } from "../ProfileCard";

interface FollowPageProps {
  profileName: string;
  variant: "followers" | "following";
  searchParams: ReadonlyURLSearchParams;
}

export const FollowPage: FC<FollowPageProps> = async ({
  profileName,
  variant,
  searchParams,
}) => {
  const profileService = new ProfileService();
  const profiles = await profileService.getFollowProfiles(
    profileName,
    variant,
    searchParams
  );

  return (
    <>
      <BackCategoryLink
        href={ROUTES.profile.root(profileName)}
        variant="RETURN"
      />
      <FeedSort orderArray={SortFollowProfilesArray} />
      <div className="grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-2">
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
