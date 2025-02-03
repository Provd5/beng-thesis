"use client";

import { type FC, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  type Formats,
  type TranslationValues,
  useTranslations,
} from "next-intl";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { zodResolver } from "@hookform/resolvers/zod";

import { demoLogin, login } from "~/lib/services/auth";
import { LoginValidator } from "~/lib/validations/auth";
import { translatableError } from "~/utils/translatableError";

import { ButtonWhite } from "../ui/Buttons";
import { Input } from "../ui/Input";

export const LoginForm: FC = () => {
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
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(LoginValidator),
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      await login(captchaToken, formData);
      toast.success(t("we will redirect you to your profile in a moment"));
    } catch (error) {
      toast.error(te(translatableError(error)));
    } finally {
      captcha.current?.resetCaptcha();
    }
  });

  return (
    <>
      {/* demo */}
      <div className="absolute inset-x-0 bottom-0 text-center">
        <button
          className="px-3 py-2"
          onClick={async () => {
            try {
              await demoLogin();
              toast.success(
                t("we will redirect you to your profile in a moment"),
              );
            } catch (error) {
              toast.error(te(translatableError(error)));
            } finally {
              captcha.current?.resetCaptcha();
            }
          }}
        >
          DEMO
        </button>
      </div>
      {/* demo */}
      <form
        className="flex max-w-sm flex-1 flex-col items-center justify-center gap-1"
        onSubmit={onSubmit}
      >
        <Input
          {...register("email", {
            required: true,
          })}
          type="email"
          autoComplete="email"
          placeholder="✉️"
          className="w-64"
          label={t("email:")}
          id="email-input"
        />
        <Input
          {...register("password", {
            required: true,
          })}
          type="password"
          placeholder="🔐"
          className="w-64"
          label={t("password:")}
          id="password-input"
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
          {t("logIn")}
        </ButtonWhite>
      </form>
    </>
  );
};
