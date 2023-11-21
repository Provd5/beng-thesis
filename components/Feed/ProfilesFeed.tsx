"use client";

import { type FC } from "react";

import { type FetchProfilesProps } from "~/types/feed/FetchProps";

import { useFetchData } from "~/hooks/useFetchData";

import { ProfileCard } from "../Explore/ProfileCard";
import { ProfileCardLoader } from "../ui/Loaders/Skeletons/ProfileCardLoader";
import { NotFoundItems } from "../ui/NotFoundItems";
import { FetchMoreButton } from "./FetchMoreButton";

export const ProfilesFeed: FC<
  FetchProfilesProps & { sessionId: string | undefined }
> = (props) => {
  const { fetchedData, fetchMore, isLoading, pageNumber } = useFetchData({
    fetchType: "profiles",
    ...props,
  });
  const profilesData = fetchedData as ProfileCardDataInterface[];

  return (
    <>
      <div className="grid grid-cols-1 justify-items-center gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          pageNumber === 1 &&
          Array.from({ length: props.takeLimit }, (_, i) => (
            <ProfileCardLoader key={i} index={i} />
          ))}
        {profilesData.map((data) => (
          <ProfileCard
            key={data.id}
            profileData={data}
            sessionId={props.sessionId}
          />
        ))}
      </div>
      {!isLoading && !profilesData.length && <NotFoundItems />}
      <FetchMoreButton
        className="flex w-full items-center justify-center py-6"
        isLoading={isLoading}
        fetchMoreFunc={fetchMore}
        takeLimit={props.takeLimit}
        pageNumber={pageNumber}
        dataLength={fetchedData.length}
      />
    </>
  );
};
