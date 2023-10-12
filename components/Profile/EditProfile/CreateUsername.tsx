"use client";

import { type FC, type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import axios from "axios";
import { z } from "zod";

import { UsernameValidator } from "~/lib/validations/auth";
import {
  GlobalErrors,
  UsernameValidatorErrors,
} from "~/lib/validations/errorsEnums";

import { Button, ButtonWhite } from "../../ui/Buttons";
import { Input } from "../../ui/Input";

interface CreateUsernameProps {
  fullName: string | null;
  cancelForm: () => void;
}

export const CreateUsername: FC<CreateUsernameProps> = ({
  fullName,
  cancelForm,
}) => {
  const t = useTranslations("Profile.EditUsername");
  const te = useTranslations("Errors");

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUsername = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();

    try {
      const form = event.currentTarget as HTMLFormElement;
      const username = form.elements.namedItem("username") as HTMLInputElement;

      if (fullName === username.value) {
        toast.error(te(UsernameValidatorErrors.SAME_USERNAME));
        return;
      }

      UsernameValidator.parse({ username: username.value });
      const { data }: { data: string } = await axios.patch(
        `/api/profile/username/`,
        {
          username: username.value,
        }
      );

      // on success
      if (data === username.value) {
        toast.success(te(GlobalErrors.SUCCESS));
        router.push(`/profile/${data}`);
      } else {
        toast.error(te(data));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(te(error.issues[0].message));
      } else {
        toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="mt-3 flex h-full flex-col items-start justify-between gap-1"
      onSubmit={handleCreateUsername}
    >
      <Input
        label={t("change/create your username:", {
          view: fullName ? "change" : "create",
        })}
        id="username-input"
        loading={isLoading}
        type="text"
        name="username"
        placeholder={t("enter username")}
        required
        autoComplete="off"
        defaultValue={fullName || ""}
      />
      <div className="flex gap-3">
        <ButtonWhite size="sm" loading={isLoading} type="submit">
          {t("submit")}
        </ButtonWhite>
        {fullName && (
          <Button
            size="sm"
            defaultColor={false}
            className="bg-red"
            onClick={() => cancelForm()}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
