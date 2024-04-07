import { type RawProfileInterface } from "~/types/data/profile";

export const transformProfileData = (
  isSession: boolean,
  profileData: RawProfileInterface
) => {
  const isFollowed = isSession ? profileData.followed_by.length > 0 : undefined;

  const profileKeys = Object.keys(profileData).filter(
    (key) => !["followed_by"].includes(key)
  ) as (keyof Omit<RawProfileInterface, "followed_by">)[];

  const profile = profileKeys.map((key) => {
    return { [key]: profileData[key] };
  });

  const data = Object.assign({}, ...profile) as Omit<
    RawProfileInterface,
    "followed_by"
  >;

  const transformedData = {
    is_followed: isFollowed,
    ...data,
  };

  return transformedData;
};
