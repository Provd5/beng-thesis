"use client";

import { type FC, useState, useTransition } from "react";
import toast from "react-hot-toast";
import {
  type Formats,
  type TranslationValues,
  useTranslations,
} from "next-intl";
import { type Provider } from "@supabase/supabase-js";

import { providerAuth } from "~/lib/services/auth/actions";
import { translatableError } from "~/utils/translatableError";

import { ButtonWhite } from "../ui/Buttons";
import { Loader } from "../ui/Loaders/Loader";

const ENABLED_PROVIDERS: Provider[] = ["discord", "google", "github"];

export const Providers: FC = () => {
  const t = useTranslations("Profile.Auth");
  const te = useTranslations("Errors") as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined,
  ) => string;

  const [isPending, startTransition] = useTransition();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );

  const handleSubmit = (provider: Provider) => {
    try {
      setSelectedProvider(provider);
      startTransition(async () => {
        await providerAuth(provider);
        toast.success(
          t("we will redirect you to the provider's website in a moment"),
        );
      });
    } catch (error) {
      toast.error(te(translatableError(error)));
    }
  };

  return ENABLED_PROVIDERS.map((provider) => (
    <ButtonWhite
      key={`Providers-${provider}`}
      type="submit"
      className="w-[220px]"
      disabled={isPending && selectedProvider === provider}
      onClick={() => handleSubmit(provider)}
    >
      <div>
        {isPending && selectedProvider === provider ? (
          <Loader className="size-6" />
        ) : (
          <p>
            {t("with")}{" "}
            <span className="first-letter:uppercase">{provider}</span>
          </p>
        )}
      </div>
    </ButtonWhite>
  ));
};
