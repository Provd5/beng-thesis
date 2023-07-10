import { type FC } from "react";
import Link from "next/link";

import { getTranslator, type Locale } from "~/dictionaries";

import { AuthForm } from "./AuthForm";

interface AuthPageProps {
  params: { lang: Locale };
  view: "logIn" | "signUp";
}

export const AuthPage: FC<AuthPageProps> = async ({ view, params }) => {
  const { Auth } = await getTranslator(params.lang);

  return (
    <div className="relative flex h-full flex-col items-center justify-between px-3 py-8 text-sm text-white-light">
      <div />
      <div className="flex flex-col items-center">
        <AuthForm Auth={Auth} view={view} />
      </div>
      <p className="text-xs">
        {Auth.byLoggingIn}{" "}
        <Link href={"/"} className="underline">
          {Auth.ourTermsOfService}
        </Link>
        .
      </p>
    </div>
  );
};
