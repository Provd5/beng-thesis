"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";
import { type Provider } from "@supabase/supabase-js";

import { AuthService } from "~/lib/services/auth";

import { ButtonWhite } from "../ui/Buttons";

export const Providers: FC = () => {
  const t = useTranslations("Profile.Auth");
  const authService = new AuthService();

  const Providers: Provider[] = ["discord", "google", "github"];

  return Providers.map((provider) => (
    <ButtonWhite
      key={provider}
      onClick={() => authService.providerAuth(provider)}
      className="w-[220px]"
    >
      {t("with")} <span className="first-letter:uppercase">{provider}</span>
    </ButtonWhite>
  ));
};
