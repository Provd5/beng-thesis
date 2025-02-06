"use client";

import { type FC, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Roboto } from "next/font/google";
import {
  type Formats,
  type TranslationValues,
  useTranslations,
} from "next-intl";
import { type Provider } from "@supabase/supabase-js";

import { type IconType } from "react-icons/lib";
import { FcGoogle } from "react-icons/fc";
import { SiDiscord } from "react-icons/si";
import { SiGithub } from "react-icons/si";

import { providerAuth } from "~/lib/services/auth/actions";
import { cn } from "~/utils/cn";
import { translatableError } from "~/utils/translatableError";

import { Loader } from "../ui/Loaders/Loader";

interface ProvidersProps {
  view: "logIn" | "signUp";
}

const robotoFont = Roboto({
  weight: ["500"],
  subsets: ["latin"],
  display: "swap",
});

const AVAILABLE_PROVIDERS: {
  Icon: IconType;
  name: Provider;
  label: string;
  color?: string;
}[] = [
  { Icon: SiDiscord, name: "discord", label: "Discord", color: "#5865F2" },
  { Icon: FcGoogle, name: "google", label: "Google" },
  { Icon: SiGithub, name: "github", label: "Github", color: "#24292f" },
];

export const Providers: FC<ProvidersProps> = ({ view }) => {
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

  return (
    <div className="flex flex-col items-center gap-1.5">
      {AVAILABLE_PROVIDERS.map((provider) => (
        <button
          key={`Providers-${provider.name}`}
          type="submit"
          className="rounded-full bg-[#F2F2F2] px-[12px] py-[10px] text-[14px]/[20px] text-[#1F1F1F] transition-transform hover:scale-105"
          disabled={isPending && selectedProvider === provider.name}
          onClick={() => handleSubmit(provider.name)}
        >
          <div className={cn(robotoFont.className, "flex items-center")}>
            <div className="mr-[12px]">
              {isPending && selectedProvider === provider.name ? (
                <Loader className="size-[20px]" />
              ) : (
                <provider.Icon
                  style={{ color: provider.color }}
                  className="size-[20px]"
                />
              )}
            </div>
            <p>
              {t("logIn/signUp with", { view })} {provider.label}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};
