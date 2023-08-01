"use client";

import { type FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { AuthForm } from "./AuthForm";

interface AuthPageProps {
  view: "logIn" | "signUp";
}

export const AuthPage: FC<AuthPageProps> = ({ view }) => {
  const t = useTranslations("Profile.Auth");

  return (
    <div className="relative flex h-full flex-col items-center justify-between px-3 py-6 text-sm text-white-light">
      <div />
      <div className="flex flex-col items-center">
        <AuthForm view={view} />
      </div>
      <p className="text-center text-xs">
        {t.rich("terms of service", {
          Link: (chunks) => (
            <Link href={"/"} className="underline">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </div>
  );
};
