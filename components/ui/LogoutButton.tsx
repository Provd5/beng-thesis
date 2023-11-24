"use client";

import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { LuLogOut } from "react-icons/lu";

import { GlobalErrors } from "~/lib/validations/errorsEnums";

import { Loader } from "./Loaders/Loader";

export const LogoutButton: FC = () => {
  const t = useTranslations("Other");
  const te = useTranslations("Errors");

  const supabase = createClientComponentClient();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const signOut = async () => {
    setIsLoading(true);

    try {
      await supabase.auth.signOut();

      toast(t("logged out"));
      router.refresh();
    } catch {
      toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="flex items-center gap-1 py-0.5"
      disabled={isLoading}
      onClick={signOut}
    >
      <div>{isLoading ? <Loader /> : <LuLogOut />}</div>
      <p>{t("logout")}</p>
    </button>
  );
};
