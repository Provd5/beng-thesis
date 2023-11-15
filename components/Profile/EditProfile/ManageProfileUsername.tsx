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
        <h1 className="mb-1 text-md">{t("your profile name:")}</h1>
        {!isEditingUsername ? (
          <div className="flex h-full w-full flex-col items-start gap-1.5">
            <ButtonWhite size="xs" onClick={() => setIsEditingUsername(true)}>
              {t("edit")}
            </ButtonWhite>
            <h2 className="min-h-[40px] break-all bg-gradient-dark bg-clip-text text-xl font-semibold text-transparent dark:bg-gradient-light">
              {userFullnameState}
            </h2>
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
