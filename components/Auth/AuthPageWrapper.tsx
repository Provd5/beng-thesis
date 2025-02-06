"use client";

import { type FC } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Link } from "~/i18n/routing";
import ROUTES from "~/utils/routes";

interface AuthPageWrapperProps {
  children: React.ReactNode;
  view: "logIn" | "signUp";
}

export const AuthPageWrapper: FC<AuthPageWrapperProps> = ({
  children,
  view,
}) => {
  const t = useTranslations("Profile.Auth");

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const checkMail = params.get("checkMail");

  if (checkMail)
    return (
      <div className="mx-auto mb-12 flex size-full max-w-sm flex-col justify-center gap-1 px-6 text-center">
        <div className="text-3xl">✉️</div>
        <h2 className="text-xl">{t("check your email to continue login")}</h2>
        <h1 className="underline">{checkMail}</h1>
      </div>
    );

  return (
    <div className="relative flex h-full flex-auto flex-col items-center justify-center px-3 py-6 text-sm text-white">
      <div className="flex flex-col items-center">
        <h1 className="mb-8 mt-3 text-3xl font-semibold">{t(view)}</h1>
        {children}
        <div className="my-3">
          {view === "logIn" && (
            <p className="text-base">
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
            <p className="text-base">
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
