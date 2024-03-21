"use client";

import { type FC, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthService } from "~/lib/services/auth";
import { SignupValidator } from "~/lib/validations/auth";
import ROUTES from "~/utils/routes";

import { ButtonWhite } from "../ui/Buttons";
import { Input } from "../ui/Input";

export const SignupForm: FC = () => {
  const t = useTranslations("Profile.Auth");

  const authService = new AuthService();
  const router = useRouter();

  const captcha = useRef<HCaptcha>(null);
  const [captchaToken, setCaptchaToken] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(SignupValidator),
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const res = await authService.signup(captchaToken, formData);
      if (res.ok) {
        toast.success(t("we will redirect you to your profile in a moment")),
          router.replace(ROUTES.profile.session_profile);
      }
    } catch (error) {
      toast.error(error as string);
    } finally {
      captcha.current?.resetCaptcha();
    }
  });

  return (
    <form
      className="flex max-w-sm flex-1 flex-col items-center justify-center gap-1"
      onSubmit={onSubmit}
    >
      <Input
        {...register("email")}
        className="w-64"
        loading={isSubmitting}
        label={t("email:")}
        id="email-input"
        type="email"
        autoComplete="email"
        placeholder="✉️"
        required
      />
      <Input
        {...register("password")}
        className="w-64"
        loading={isSubmitting}
        label={t("password:")}
        id="password-input"
        type="password"
        placeholder="🔐"
        required
      />
      <Input
        {...register("password-repeat")}
        className="w-64"
        loading={isSubmitting}
        label={t("repeat password:")}
        id="password-repeat-input"
        type="password"
        placeholder="🔒"
        required
      />
      <div className="mt-1 overflow-hidden rounded-sm">
        <HCaptcha
          ref={captcha}
          sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY as string}
          onVerify={(token) => {
            setCaptchaToken(token);
          }}
        />
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
