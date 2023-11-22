"use client";

import type { Dispatch, FC, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import { type Provider } from "@supabase/supabase-js";

import { ButtonWhite } from "../ui/Buttons";

interface ProvidersProps {
  handleProviderLogin: (providerType: Provider) => Promise<void>;
  view: "logIn" | "signUp";
  setLoginByEmail: Dispatch<SetStateAction<boolean>>;
}

export const Providers: FC<ProvidersProps> = ({
  handleProviderLogin,
  view,
  setLoginByEmail,
}) => {
  const t = useTranslations("Profile.Auth");
  const Providers: Provider[] = ["discord", "google", "github"];

  return (
    <div className="flex flex-col items-center gap-1">
      {Providers.map((provider) => (
        <ButtonWhite
          key={provider}
          onClick={() => handleProviderLogin(provider)}
          className="w-[220px]"
        >
          {t("with")} <span className="first-letter:uppercase">{provider}</span>
        </ButtonWhite>
      ))}
      <button
        className="mt-5 font-semibold underline"
        onClick={() => setLoginByEmail(true)}
      >
        {t("logIn/signUp with email and password", { view: view })}
      </button>
    </div>
  );
};
