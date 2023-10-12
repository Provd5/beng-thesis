"use client";

import { type FC, useState } from "react";

import { ButtonWhite } from "~/components/ui/Buttons";

import { CreateUsername } from "./CreateUsername";

interface ManageProfileUsernameProps {
  userFullname: string | null;
}

export const ManageProfileUsername: FC<ManageProfileUsernameProps> = ({
  userFullname,
}) => {
  const [isEditingUsername, setIsEditingUsername] = useState(
    userFullname ? false : true
  );

  return (
    <>
      <div className="flex h-[140px] flex-col items-start">
        <h1 className="text-md">Your username:</h1>
        {!isEditingUsername ? (
          <div className="flex h-full flex-col items-start gap-3">
            <h2 className="mt-1 break-all bg-gradient-dark bg-clip-text text-xl font-semibold text-transparent dark:bg-gradient-light">
              {userFullname}
            </h2>
            <ButtonWhite size="xs" onClick={() => setIsEditingUsername(true)}>
              Edit username
            </ButtonWhite>
          </div>
        ) : (
          <CreateUsername
            fullName={userFullname}
            cancelForm={() => setIsEditingUsername(false)}
          />
        )}
      </div>
    </>
  );
};
