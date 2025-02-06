"use client";

import { type FC, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import HCaptcha from "@hcaptcha/react-hcaptcha";

import { cn } from "~/utils/cn";

import { AuthPageWrapper } from "./AuthPageWrapper";
import { LoginForm } from "./LoginForm";
import { Providers } from "./Providers";
import { SignupForm } from "./SignupForm";

interface AuthPageProps {
  view: "logIn" | "signUp";
}

export const AuthPage: FC<AuthPageProps> = ({ view }) => {
  const t = useTranslations("Profile.Auth");

  const [showForm, setShowForm] = useState(false);

  const captchaSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY!;
  const captcha = useRef<HCaptcha>(null);
  const [captchaToken, setCaptchaToken] = useState("");

  return (
    <AuthPageWrapper view={view}>
      <div className={cn(showForm && "hidden")}>
        <Providers view={view} />
        <button
          className="mx-auto mt-8 w-full font-semibold underline"
          onClick={() => setShowForm(true)}
        >
          {t("logIn/signUp with password", { view })}
        </button>
      </div>
      <div className={cn(!showForm && "hidden")}>
        {view === "logIn" && (
          <LoginForm
            captchaToken={captchaToken}
            resetCaptcha={() => captcha.current?.resetCaptcha()}
          />
        )}
        {view === "signUp" && (
          <SignupForm
            captchaToken={captchaToken}
            resetCaptcha={() => captcha.current?.resetCaptcha()}
          />
        )}
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
        <button
          className="mx-auto mt-8 w-full font-semibold underline"
          onClick={() => setShowForm(false)}
        >
          {t("logIn/signUp with provider", { view })}
        </button>
      </div>
    </AuthPageWrapper>
  );
};
