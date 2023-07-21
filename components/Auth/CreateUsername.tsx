"use client";

import { type FC, type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import axios from "axios";
import { z } from "zod";

import { UsernameValidator } from "~/lib/validations/auth";
import {
  AuthErrors,
  UsernameValidatorErrors,
} from "~/lib/validations/errorsEnums";

import { ButtonWhite } from "../ui/Buttons";
import { Input } from "../ui/Input";

interface CreateUsernameProps {
  fullName: string | null;
}

export const CreateUsername: FC<CreateUsernameProps> = ({ fullName }) => {
  const t = useTranslations("EditUsername");
  const te = useTranslations("AuthErrors");

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUsername = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();

    try {
      const form = event.currentTarget as HTMLFormElement;
      const username = form.elements.namedItem("username") as HTMLInputElement;

      if (fullName === username.value) {
        toast.error(te(UsernameValidatorErrors.same_username));
        return;
      }

      UsernameValidator.parse(username.value);
      const { data }: { data: string } = await axios.patch(
        `/api/username/`,
        username.value
      );

      data === AuthErrors.username_exists && toast.error(te(data));

      // on success
      if (data === username.value) {
        toast.success(te(AuthErrors.success));
        router.push(`/profile/${data}`);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.map((error) => {
          toast.error(te(error.message));
        });
      } else {
        toast.error(te(AuthErrors.something_went_wrong));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col items-center justify-center gap-1"
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
      />
      <ButtonWhite loading={isLoading} type="submit" className="mt-2 uppercase">
        {t("submit")}
      </ButtonWhite>
    </form>
  );
};
