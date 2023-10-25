"use client";

import { type FC, useState } from "react";
import { useTranslations } from "next-intl";

import { ButtonWhite } from "~/components/ui/Buttons";

import { EditProfileForm } from "./EditProfileForm";

interface ManageProfileDescriptionProps {
  userDescription: string | null;
}

export const ManageProfileDescription: FC<ManageProfileDescriptionProps> = ({
  userDescription,
}) => {
  const t = useTranslations("Profile.EditProfile");

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [userDescriptionState, setUserDescriptionState] =
    useState(userDescription);

  return (
    <>
      <div className="flex flex-col items-start">
        <h1 className="text-md">{t("your profile description:")}</h1>
        {!isEditingDescription ? (
          <div className="flex h-full w-full flex-col items-start gap-3">
            <h2 className="mt-1 text-xs">{userDescriptionState}</h2>
            <ButtonWhite
              size="xs"
              onClick={() => setIsEditingDescription(true)}
            >
              {t("edit")}
            </ButtonWhite>
          </div>
        ) : (
          <EditProfileForm
            formType="description"
            data={userDescription}
            setData={setUserDescriptionState}
            cancelForm={() => setIsEditingDescription(false)}
          />
        )}
      </div>
    </>
  );
};
