"use client";

import { type FC, type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import axios from "axios";
import { z } from "zod";

import { MdNavigateBefore } from "react-icons/md";

import { UsernameValidator } from "~/lib/validations/auth";
import {
  AuthErrors,
  UsernameValidatorErrors,
} from "~/lib/validations/errorsEnums";
import { dateFormater } from "~/utils/dateFormater";

import { AvatarImage } from "../ui/AvatarImage";
import { ButtonWhite } from "../ui/Buttons";
import { Input } from "../ui/Input";

interface CreateUsernameProps {
  avatarSrc?: string | null;
  email: string;
  createdAt: Date;
  fullName: string | null;
}

export const CreateUsername: FC<CreateUsernameProps> = ({
  avatarSrc,
  email,
  createdAt,
  fullName,
}) => {
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
        router.push(`/${data}`);
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
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative mb-10 flex h-full max-w-sm flex-col items-center justify-center gap-6 px-3 py-6 text-sm text-white-light">
        {fullName && (
          <Link href={`/profile`} className="self-start">
            <div className="flex items-center justify-center text-xs">
              <MdNavigateBefore className="text-md" />
              <p>{t("back to profile")}</p>
            </div>
          </Link>
        )}

        <div className="flex flex-col gap-1">
          {avatarSrc && (
            <AvatarImage
              size="lg"
              avatarSrc={avatarSrc}
              className="mb-1 self-center"
            />
          )}
          <p>
            <span className="font-semibold">{t("email:")}</span> {email}
          </p>
          <p>
            <span className="font-semibold">{t("account created:")}</span>{" "}
            {dateFormater(createdAt, true)}
          </p>
        </div>
        <form
          className="flex flex-col items-center justify-center gap-3"
          onSubmit={handleCreateUsername}
        >
          <p className="text-md">
            {t("change/create your username:", {
              view: fullName ? "change" : "create",
            })}
          </p>
          <Input
            id="username-input"
            loading={isLoading}
            type="text"
            name="username"
            placeholder={t("enter new username")}
            defaultValue={fullName ?? ""}
            required
            autoComplete="off"
          />
          <ButtonWhite loading={isLoading} type="submit" className="uppercase">
            {t("submit")}
          </ButtonWhite>
        </form>
      </div>
    </div>
  );
};
