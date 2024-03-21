"use client";

import { type FC } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";

import { type GetProfileInterface } from "~/types/data/profile";

import { ButtonWhite } from "~/components/ui/Buttons";
import { Input } from "~/components/ui/Input";
import { ProfileService } from "~/lib/services/profile";
import { GlobalErrors } from "~/lib/validations/errorsEnums";
import { EditProfileValidator } from "~/lib/validations/profile";

interface EditProfileFormProps {
  profileData: GetProfileInterface;
}

export const EditProfileForm: FC<EditProfileFormProps> = ({ profileData }) => {
  const t = useTranslations("Profile.EditProfile");
  const te = useTranslations("Errors");

  const profileService = new ProfileService();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(EditProfileValidator),
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const res = await profileService.editProfile(formData);

      if (res.ok) toast.success(te(GlobalErrors.SUCCESS));
    } catch (error) {
      toast.error(error as string);
    }
  });

  return (
    <form
      className="flex h-full w-full flex-col items-start gap-1.5"
      onSubmit={onSubmit}
    >
      <div className="mt-3 flex flex-col items-start">
        <h1 className="mb-1 text-md">{t("profile visibility:")}</h1>
        <label className="mb-2 inline-flex cursor-pointer items-center">
          <input
            {...register("private")}
            type="checkbox"
            checked={profileData.private}
            className="peer sr-only"
          />
          <div className="peer relative h-6 w-11 rounded-full bg-black-light after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:bg-secondary-light peer-checked:after:translate-x-full peer-focus:outline-none dark:bg-white-dark dark:after:bg-black dark:peer-checked:bg-secondary-light"></div>
          <span className="ml-2">
            {t("public/private", {
              view: profileData.private ? "private" : "public",
            })}
          </span>
        </label>
      </div>
      <Input
        {...register("username")}
        loading={isSubmitting}
        type="text"
        id="username-input"
        placeholder={t("enter username")}
        required
        autoComplete="off"
        minLength={3}
        maxLength={32}
        defaultValue={profileData.full_name || ""}
      />
      <Input
        {...register("description")}
        isTextarea
        loading={isSubmitting}
        type="text"
        id="description-input"
        placeholder={t("add profile description")}
        maxLength={5000}
        defaultValue={profileData.description || ""}
      />

      <ButtonWhite size="xs" loading={isSubmitting} type="submit">
        {t("save")}
      </ButtonWhite>
    </form>
  );
};
