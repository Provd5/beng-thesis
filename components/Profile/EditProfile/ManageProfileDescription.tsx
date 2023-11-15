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
        <h1 className="mb-1 text-md">{t("your profile description:")}</h1>
        {!isEditingDescription ? (
          <div className="flex h-full w-full flex-col items-start gap-1.5">
            <ButtonWhite
              size="xs"
              onClick={() => setIsEditingDescription(true)}
            >
              {t("edit")}
            </ButtonWhite>
            <h2 className="mt-1 whitespace-break-spaces rounded-md bg-white p-3 text-xs dark:bg-black">
              {userDescriptionState}
            </h2>
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
