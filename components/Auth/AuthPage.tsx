"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { AuthForm } from "./AuthForm";

interface AuthPageProps {
  view: "logIn" | "signUp";
}

export const AuthPage: FC<AuthPageProps> = ({ view }) => {
  const t = useTranslations("Profile.Auth");

  const [checkMail, setCheckMail] = useState<string>();

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-3 py-6 text-sm text-white-light">
      {/* <div /> */}
      <div className="flex flex-col items-center">
        {checkMail ? (
          <h1 className="flex flex-col gap-1 px-6 text-center text-xl">
            <span className="text-3xl">✉️</span>
            {t("check your email to continue login", { email: checkMail })}
          </h1>
        ) : (
          <>
            <h1 className="mb-8 mt-3 text-3xl font-semibold">{t(view)}</h1>
            <AuthForm setCheckMail={setCheckMail} view={view} />
            <div className="mb-3 mt-10">
              {view === "logIn" && (
                <p>
                  {t.rich("no account yet? sign up", {
                    Link: (chunks) => (
                      <Link href="/signup" className="font-semibold underline">
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
                      <Link href="/login" className="font-semibold underline">
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              )}
            </div>
          </>
        )}
      </div>
      {/* <p className="text-center text-xs">
        {t.rich("terms of service", {
          Link: (chunks) => (
            <Link href={"/"} className="underline">
              {chunks}
            </Link>
          ),
        })}
      </p> */}
    </div>
  );
};
