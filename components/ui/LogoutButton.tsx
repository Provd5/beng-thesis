"use client";

import type { FC } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { LuLogOut } from "react-icons/lu";

import { Loader } from "./Loader";

export const LogoutButton: FC = () => {
  const t = useTranslations("Other");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    router.refresh();
    setIsLoading(false);
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
