import type { FC } from "react";

import { AvatarImage } from "~/components/Profile/AvatarImage";

import { TextLoader } from "../Loader";

interface ProfileCardLoaderProps {
  index: number;
}

export const ProfileCardLoader: FC<ProfileCardLoaderProps> = ({ index }) => {
  return (
    <div
      className="flex h-full w-full max-w-[400px] animate-pulse flex-col gap-2 rounded-md bg-white px-6 py-3 drop-shadow dark:bg-black"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex flex-auto flex-col gap-1">
        <div className="flex gap-1">
          <AvatarImage isLoader size="sm" className="drop-shadow-icon" />
          <div className="flex w-full flex-col gap-0.5">
            <TextLoader height="h2" className="w-32" />
            <div className="my-0.5 flex gap-1.5">
              <div className="h-5 w-7 rounded bg-gray" />
              <div className="h-5 w-7 rounded bg-gray" />
              <div className="h-5 w-7 rounded bg-gray" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-0.5 text-xs">
          <TextLoader height="h3" className="w-32" />
          <TextLoader height="h3" className="w-28" />

          <TextLoader height="h3" className="w-24" />
          <div className="flex flex-col gap-px">
            <TextLoader height="h2" className="w-11/12" />
            <TextLoader height="h2" className="w-10/12" />
          </div>
        </div>
      </div>
      <div className="h-8 w-2/3 max-w-[200px] self-end rounded-sm bg-gray" />
    </div>
  );
};
