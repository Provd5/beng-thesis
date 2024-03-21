import type { FC } from "react";

import { AvatarImage } from "~/components/Profile/AvatarImage";

export const EditProfileLoader: FC = () => {
  return (
    <>
      <div className="flex gap-3">
        <div className="ml-0 mt-[-30px] xs:ml-6">
          <div className="bodyGradientForAvatar relative flex h-[112px] w-[112px] items-center justify-center rounded-full">
            <AvatarImage size="lg" className="animate-pulse" isLoader />
          </div>
        </div>
        <div
          className="mt-3 flex animate-pulse flex-col gap-1"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="h-5 w-40 rounded-sm bg-gray" />
          <div className="h-6 w-36 rounded-sm bg-gray" />
        </div>
      </div>
      <div className="mt-7 flex flex-col gap-7">
        <div
          className="flex animate-pulse flex-col gap-2"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="h-5 w-44 rounded-sm bg-gray" />
          <div className="h-8 w-[74px] rounded-sm bg-gray" />
          <div className="h-7 w-56 rounded-md bg-gray" />
        </div>
        <div
          className="flex animate-pulse flex-col gap-2"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="h-5 w-36 rounded-sm bg-gray" />
          <div className="h-8 w-[74px] rounded-sm bg-gray" />
          <div className="h-36 w-full rounded-md bg-gray" />
        </div>
      </div>
    </>
  );
};
