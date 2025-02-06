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

import { type GetProfileInterface } from "~/types/data/profile";

import { Button } from "~/components/ui/Buttons";
import { Input } from "~/components/ui/Input";
import { editProfile } from "~/lib/services/profile/actions";
import { ErrorsToTranslate } from "~/lib/validations/errorsEnums";
import { EditProfileValidator } from "~/lib/validations/profile";
import { cn } from "~/utils/cn";
import { translatableError } from "~/utils/translatableError";

interface EditProfileFormProps {
  profileData: GetProfileInterface;
}

export const EditProfileForm: FC<EditProfileFormProps> = ({ profileData }) => {
  const t = useTranslations("Profile.EditProfile");
  const te = useTranslations("Errors") as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined,
  ) => string;

  const [isPrivate, setIsPrivate] = useState(profileData.private);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isDirty },
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
      if (!res.success) throw new Error(res.error);
      toast.success(te(ErrorsToTranslate.SUCCESS));
    } catch (e) {
      toast.error(te(translatableError(e)));
    }
  });

  return (
    <form
      className="flex size-full flex-col items-start gap-1.5"
      onSubmit={onSubmit}
    >
      <div className="mt-3 flex flex-col items-start">
        <h1 className="text-md mb-1">{t("profile visibility:")}</h1>
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
            className={cn(
              "peer relative h-6 w-11 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-focus:outline-none dark:after:bg-black",
              isPrivate
                ? "bg-colors-primary after:translate-x-full"
                : "bg-black dark:bg-white",
            )}
            onClick={() => (
              setValue("private", !isPrivate, { shouldDirty: true }),
              setIsPrivate(!isPrivate)
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

      <Button
        size="xs"
        loading={isSubmitting}
        disabled={!isDirty}
        type="submit"
        className={cn(
          "transition-colors",
          isPrivate === profileData.private &&
            !isDirty &&
            "bg-colors-gray/20 text-white hover:bg-colors-gray/20",
        )}
      >
        {t("save")}
      </Button>
    </form>
  );
};
