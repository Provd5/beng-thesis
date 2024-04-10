"use client";

import type { FC } from "react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  type Formats,
  type TranslationValues,
  useTranslations,
} from "next-intl";
import { createBrowserClient } from "@supabase/ssr";

import { LuLogOut } from "react-icons/lu";

import { translatableError } from "~/utils/translatableError";

import { Loader } from "../ui/Loaders/Loader";

export const LogoutButton: FC = () => {
  const t = useTranslations("Other");
  const te = useTranslations("Errors") as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined
  ) => string;

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const signOut = async () => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(translatableError(error));
      }

      startTransition(() => {
        router.refresh();
      });
      toast(t("logged out"));
    } catch (error) {
      toast.error(te(translatableError(error)));
    }
  };

  return (
    <>
      <button
        className="flex items-center gap-1 py-0.5 transition-transform hover:translate-x-1"
        disabled={isPending}
        onClick={signOut}
      >
        <div>{isPending ? <Loader /> : <LuLogOut />}</div>
        <p>{isPending ? t("logging out") : t("logout")}</p>
      </button>
    </>
  );
};
