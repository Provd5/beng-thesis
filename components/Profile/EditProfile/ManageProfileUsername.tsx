"use client";

import { type FC, useState } from "react";
import { useTranslations } from "next-intl";

import { ButtonWhite } from "~/components/ui/Buttons";

import { EditProfileForm } from "./EditProfileForm";

interface ManageProfileUsernameProps {
  userFullname: string | null;
}

export const ManageProfileUsername: FC<ManageProfileUsernameProps> = ({
  userFullname,
}) => {
  const t = useTranslations("Profile.EditProfile");

  const [isEditingUsername, setIsEditingUsername] = useState(
    userFullname ? false : true
  );
  const [userFullnameState, setUserFullnameState] = useState(userFullname);

  return (
    <>
      <div className="flex flex-col items-start">
        <h1 className="text-md">{t("your profile name:")}</h1>
        {!isEditingUsername ? (
          <div className="flex h-full w-full flex-col items-start gap-3">
            <h2 className="mt-1 break-all bg-gradient-dark bg-clip-text text-xl font-semibold text-transparent dark:bg-gradient-light">
              {userFullnameState}
            </h2>
            <ButtonWhite size="xs" onClick={() => setIsEditingUsername(true)}>
              {t("edit")}
            </ButtonWhite>
          </div>
        ) : (
          <EditProfileForm
            formType="username"
            data={userFullnameState}
            setData={setUserFullnameState}
            cancelForm={() => setIsEditingUsername(false)}
          />
        )}
      </div>
    </>
  );
};
