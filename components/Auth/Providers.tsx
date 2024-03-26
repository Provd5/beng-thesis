"use client";

import type { FC } from "react";
import toast from "react-hot-toast";
import {
  type Formats,
  type TranslationValues,
  useTranslations,
} from "next-intl";
import { type Provider } from "@supabase/supabase-js";

import { AuthService } from "~/lib/services/auth";
import { ErrorsToTranslate } from "~/lib/validations/errorsEnums";
import { translatableError } from "~/utils/translatableError";

import { ButtonWhite } from "../ui/Buttons";

export const Providers: FC = () => {
  const t = useTranslations("Profile.Auth");
  const te = useTranslations("Errors") as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined
  ) => string;

  const Providers: Provider[] = ["discord", "google", "github"];

  const authService = new AuthService();

  const onSubmit = async (provider: Provider) => {
    try {
      const res = await authService.providerAuth(provider);
      if (!res.ok) {
        throw new Error(ErrorsToTranslate.SOMETHING_WENT_WRONG);
      }
      toast.success(
        t("we will redirect you to the provider's website in a moment")
      );
    } catch (error) {
      toast.error(te(translatableError(error)));
    }
  };

  return Providers.map((provider) => (
    <ButtonWhite
      key={provider}
      type="submit"
      className="w-[220px]"
      onClick={() => onSubmit(provider)}
    >
      {t("with")} <span className="first-letter:uppercase">{provider}</span>
    </ButtonWhite>
  ));
};
