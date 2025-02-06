"use client";

import { type FC } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  type Formats,
  type TranslationValues,
  useTranslations,
} from "next-intl";

import { signUp } from "~/lib/services/auth/actions";
import { translatableError } from "~/utils/translatableError";

import { ButtonWhite } from "../ui/Buttons";
import { Input } from "../ui/Input";

interface SignupFormProps {
  captchaToken: string;
  resetCaptcha: () => void;
}

export const SignupForm: FC<SignupFormProps> = ({
  captchaToken,
  resetCaptcha,
}) => {
  const t = useTranslations("Profile.Auth");
  const te = useTranslations("Errors") as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined,
  ) => string;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "", repeat_password: "" },
  });

  const onSubmit = async (formData: unknown) => {
    try {
      const res = await signUp(captchaToken, formData);
      if (!res.success) throw new Error(res.error);
    } catch (error) {
      toast.error(te(translatableError(error)));
    } finally {
      resetCaptcha();
    }
  };

  return (
    <form
      className="flex max-w-sm flex-1 flex-col items-center justify-center gap-1"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        {...register("email", { required: true })}
        type="email"
        autoComplete="email"
        placeholder="✉️"
        className="w-64"
        label={t("email:")}
        id="email-input"
      />
      <Input
        {...register("password", { required: true })}
        type="password"
        placeholder="🔐"
        className="w-64"
        label={t("password:")}
        id="password-input"
      />
      <Input
        {...register("repeat_password", { required: true })}
        type="password"
        placeholder="🔒"
        className="w-64"
        label={t("repeat password:")}
        id="repeat-password-input"
      />
      <ButtonWhite
        loading={isSubmitting}
        type="submit"
        className="my-2 uppercase"
      >
        {t("signUp")}
      </ButtonWhite>
    </form>
  );
};
