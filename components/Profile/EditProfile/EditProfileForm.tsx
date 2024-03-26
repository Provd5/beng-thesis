"use client";

import { type FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  type Formats,
  type TranslationValues,
  useTranslations,
} from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";

import { type GetProfileInterface } from "~/types/data/profile";

import { ButtonWhite } from "~/components/ui/Buttons";
import { Input } from "~/components/ui/Input";
import { editProfile } from "~/lib/services/profile";
import { ErrorsToTranslate } from "~/lib/validations/errorsEnums";
import { EditProfileValidator } from "~/lib/validations/profile";
import { translatableError } from "~/utils/translatableError";

interface EditProfileFormProps {
  profileData: GetProfileInterface;
}

export const EditProfileForm: FC<EditProfileFormProps> = ({ profileData }) => {
  const t = useTranslations("Profile.EditProfile");
  const te = useTranslations("Errors") as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined
  ) => string;

  const [isPrivate, setIsPrivate] = useState(profileData.private);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      private: profileData.private,
      username: profileData.full_name,
      description: profileData.description,
    },
    resolver: zodResolver(EditProfileValidator),
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const validData = EditProfileValidator.parse(formData);

      const res = await editProfile(validData);

      if (res.success) toast.success(te(ErrorsToTranslate.SUCCESS));
    } catch (e) {
      toast.error(te(translatableError(e)));
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
            defaultChecked={isPrivate}
            className="peer sr-only"
            id="visibility-input"
          />
          <button
            type="button"
            className={clsx(
              "peer relative h-6 w-11 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-focus:outline-none dark:after:bg-black",
              isPrivate
                ? "bg-secondary-light after:translate-x-full dark:bg-secondary-light"
                : "bg-black-light dark:bg-white-dark"
            )}
            onClick={() => (
              setValue("private", !isPrivate), setIsPrivate(!isPrivate)
            )}
          />
          <span className="ml-2">
            {t("public/private", {
              view: isPrivate ? "private" : "public",
            })}
          </span>
        </label>
      </div>
      <Input
        {...register("username", {
          minLength: 3,
          maxLength: 32,
          required: true,
        })}
        type="text"
        placeholder={t("enter username")}
        autoComplete="off"
        defaultValue={profileData.full_name || ""}
        id="username-input"
      />
      <Input
        {...register("description", {
          maxLength: 5000,
        })}
        placeholder={t("add profile description")}
        defaultValue={profileData.description || ""}
        id="description-input"
        isTextarea
      />

      <ButtonWhite size="xs" loading={isSubmitting} type="submit">
        {t("save")}
      </ButtonWhite>
    </form>
  );
};
