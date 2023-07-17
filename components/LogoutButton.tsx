"use client";

import type { FC } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { FaPowerOff } from "react-icons/fa";

import { Loader } from "./ui/Loader";

interface LogoutButtonProps {
  text: string;
}

export const LogoutButton: FC<LogoutButtonProps> = ({ text }) => {
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
      className="flex items-center gap-1 text-base"
      disabled={isLoading}
      onClick={signOut}
    >
      <div className="h-4 w-4">{isLoading ? <Loader /> : <FaPowerOff />}</div>

      <p>{text}</p>
    </button>
  );
};
