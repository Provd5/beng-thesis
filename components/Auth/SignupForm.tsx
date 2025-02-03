"use client";

import { type FC, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  type Formats,
  type TranslationValues,
  useTranslations,
} from "next-intl";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { zodResolver } from "@hookform/resolvers/zod";

import { signUp } from "~/lib/services/auth";
import { SignupValidator } from "~/lib/validations/auth";
import { translatableError } from "~/utils/translatableError";

import { ButtonWhite } from "../ui/Buttons";
import { Input } from "../ui/Input";

export const SignupForm: FC = () => {
  const t = useTranslations("Profile.Auth");
  const te = useTranslations("Errors") as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined,
  ) => string;

  const captchaSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY!;
  const captcha = useRef<HCaptcha>(null);
  const [captchaToken, setCaptchaToken] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "", repeat_password: "" },
    resolver: zodResolver(SignupValidator),
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      await signUp(captchaToken, formData);
    } catch (error) {
      toast.error(te(translatableError(error)));
    } finally {
      captcha.current?.resetCaptcha();
    }
  });

  return (
    <form
      className="flex max-w-sm flex-1 flex-col items-center justify-center gap-1"
      onSubmit={(e) => (e.preventDefault(), onSubmit())}
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
      <div className="mt-1 overflow-hidden rounded-sm">
        {captchaToken === "" && (
          <HCaptcha
            ref={captcha}
            sitekey={captchaSiteKey}
            onVerify={(token) => {
              setCaptchaToken(token);
            }}
          />
        )}
      </div>
      <ButtonWhite
        loading={isSubmitting}
        type="submit"
        className="my-5 uppercase"
      >
        {t("signUp")}
      </ButtonWhite>
    </form>
  );
};
