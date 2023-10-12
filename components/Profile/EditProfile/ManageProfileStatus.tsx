"use client";

import { type FC, useState } from "react";

import { ButtonWhite } from "~/components/ui/Buttons";

interface ManageProfileStatusProps {
  isPrivate: boolean;
}

export const ManageProfileStatus: FC<ManageProfileStatusProps> = ({
  isPrivate,
}) => {
  const [isPrivateState, setIsPrivateState] = useState(isPrivate);

  return (
    <>
      <div className="mt-3 flex flex-col items-start">
        <h1 className="mb-1 text-md">Profile visibility:</h1>
        <label className="mb-2 inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            value=""
            checked={isPrivateState}
            onChange={() => setIsPrivateState(!isPrivateState)}
            className="peer sr-only"
          />
          <span className="mr-2">Private</span>
          <div className="peer relative h-6 w-11 rounded-full bg-black-light after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:bg-secondary-light peer-checked:after:translate-x-full peer-focus:outline-none dark:bg-white-dark dark:after:bg-black dark:peer-checked:bg-secondary-light"></div>
        </label>
        <ButtonWhite
          className={isPrivate === isPrivateState ? "invisible" : ""}
          disabled={isPrivate === isPrivateState ? true : false}
          size="xs"
        >
          Save
        </ButtonWhite>
      </div>
    </>
  );
};
