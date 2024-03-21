"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import ROUTES from "~/utils/routes";

import { Providers } from "./Providers";

interface AuthPageProps {
  children: React.ReactNode;
  view: "logIn" | "signUp";
}

export const AuthPage: FC<AuthPageProps> = ({ children, view }) => {
  const t = useTranslations("Profile.Auth");

  const [providerAuth, setProviderAuth] = useState(true);

  return (
    <div className="relative flex h-full flex-auto flex-col items-center justify-center px-3 py-6 text-sm text-white-light">
      <div className="flex flex-col items-center">
        <h1 className="mb-8 mt-3 text-3xl font-semibold">{t(view)}</h1>
        {providerAuth ? (
          <div className="flex flex-col items-center gap-1">
            <Providers />
            <button
              className="mt-5 font-semibold underline"
              onClick={() => setProviderAuth(false)}
            >
              {t("logIn/signUp with email and password", { view })}
            </button>
          </div>
        ) : (
          <>
            {children}
            <button
              className="font-semibold underline"
              onClick={() => setProviderAuth(true)}
            >
              {t("logIn/signUp with provider", { view })}
            </button>
          </>
        )}
        <div className="mb-3 mt-10">
          {view === "logIn" && (
            <p>
              {t.rich("no account yet? sign up", {
                Link: (chunks) => (
                  <Link
                    href={ROUTES.auth.signup}
                    className="font-semibold underline"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          )}
          {view === "signUp" && (
            <p>
              {t.rich("already have an account? log in", {
                Link: (chunks) => (
                  <Link
                    href={ROUTES.auth.login}
                    className="font-semibold underline"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
