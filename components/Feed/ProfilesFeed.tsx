"use client";

import { type FC } from "react";

import {
  type FetchProfilesProps,
  useFetchProfiles,
} from "~/hooks/feed/useFetchProfiles";

import { ProfileCard } from "../Explore/ProfileCard";
import { ProfileCardLoader } from "../ui/Loaders/Skeletons/ProfileCardLoader";
import { FetchMoreButton } from "./FetchMoreButton";

export const ProfilesFeed: FC<FetchProfilesProps> = (props) => {
  const { fetchedData, fetchMore, isLoading, pageNumber } =
    useFetchProfiles(props);

  return (
    <>
      <div className="grid grid-cols-1 justify-items-center gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          pageNumber === 1 &&
          Array.from({ length: props.takeLimit }, (_, i) => (
            <ProfileCardLoader key={i} />
          ))}
        {fetchedData.map((data) => (
          <ProfileCard
            key={data.id}
            profileData={data}
            sessionId={props.sessionId}
          />
        ))}
      </div>
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
