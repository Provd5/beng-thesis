import { type FC } from "react";
import Link from "next/link";

import { getTranslator, type Locale } from "~/dictionaries";

import { AuthForm } from "./AuthForm";

interface AuthPageProps {
  params: { lang: Locale };
  view: "logIn" | "signUp";
}

export const AuthPage: FC<AuthPageProps> = async ({ view, params }) => {
  const t = await getTranslator(params.lang);

  return (
    <div className="relative flex h-full flex-col items-center justify-between px-3 py-8 text-sm text-white-light">
      <div />
      <div className="flex flex-col items-center">
        <AuthForm t={t} view={view} />
      </div>
      <p className="text-xs">
        {t.Auth.byLoggingIn}{" "}
        <Link href={"/"} className="underline">
          {t.Auth.ourTermsOfService}
        </Link>
        .
      </p>
    </div>
  );
};
