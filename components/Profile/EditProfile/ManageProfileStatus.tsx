"use client";

import { type FC, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import axios from "axios";
import { z } from "zod";

import { ButtonWhite } from "~/components/ui/Buttons";
import { GlobalErrors } from "~/lib/validations/errorsEnums";
import { ProfileVisibilityValidator } from "~/lib/validations/profileVisibility";

interface ManageProfileStatusProps {
  isPrivate: boolean;
}

export const ManageProfileStatus: FC<ManageProfileStatusProps> = ({
  isPrivate,
}) => {
  const t = useTranslations("Profile.EditProfile");
  const te = useTranslations("Errors");

  const [isPrivateState, setIsPrivateState] = useState(isPrivate);
  const [renderSaveButton, setRenderSaveButton] = useState(isPrivate);

  const handleUpdate = async () => {
    const loadingToast = toast.loading(te(GlobalErrors.PENDING));

    try {
      if (renderSaveButton === isPrivateState) return;
      ProfileVisibilityValidator.parse({ isPrivate: isPrivateState });

      const { data }: { data: string } = await axios.patch(
        `/api/profile/visibility/`,
        {
          isPrivate: isPrivateState,
        }
      );

      if (data !== GlobalErrors.SUCCESS) {
        toast.error(te(data));
        return;
      }

      // on success
      toast.success(te(GlobalErrors.SUCCESS));
      setRenderSaveButton(isPrivateState);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(te(error.issues[0].message));
      } else {
        toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
      }
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <>
      <div className="mt-3 flex flex-col items-start">
        <h1 className="mb-1 text-md">{t("profile visibility:")}</h1>
        <label className="mb-2 inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={isPrivateState}
            onChange={() => setIsPrivateState(!isPrivateState)}
            className="peer sr-only"
          />
          <div className="peer relative h-6 w-11 rounded-full bg-black-light after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:bg-secondary-light peer-checked:after:translate-x-full peer-focus:outline-none dark:bg-white-dark dark:after:bg-black dark:peer-checked:bg-secondary-light"></div>
          <span className="ml-2">
            {t("public/private", {
              view: isPrivateState ? "private" : "public",
            })}
          </span>
        </label>
        <ButtonWhite
          onClick={() => handleUpdate()}
          className={renderSaveButton === isPrivateState ? "invisible" : ""}
          disabled={renderSaveButton === isPrivateState ? true : false}
          size="xs"
        >
          {t("save")}
        </ButtonWhite>
      </div>
    </>
  );
};
