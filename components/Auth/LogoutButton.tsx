"use client";

import type { FC } from "react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import {
  type Formats,
  type TranslationValues,
  useTranslations,
} from "next-intl";

import { LuLogOut } from "react-icons/lu";

import { signOut } from "~/lib/services/auth/actions";
import { translatableError } from "~/utils/translatableError";

import { Loader } from "../ui/Loaders/Loader";

export const LogoutButton: FC = () => {
  const t = useTranslations("Other");
  const te = useTranslations("Errors") as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined,
  ) => string;

  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    try {
      startTransition(async () => {
        const res = await signOut();
        if (!res.success) throw new Error(res.error);
      });
      toast.success(t("logged out"));
    } catch (error) {
      toast.error(te(translatableError(error)));
    }
  };

  return (
    <>
      <button
        className="flex items-center gap-1 py-0.5 transition-transform hover:translate-x-1"
        disabled={isPending}
        onClick={handleSignOut}
      >
        <div>{isPending ? <Loader /> : <LuLogOut />}</div>
        <p>{isPending ? t("logging out") : t("logout")}</p>
      </button>
    </>
  );
};
