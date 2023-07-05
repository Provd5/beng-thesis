"use client";

import type { FC } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Button } from "./ui/Buttons";

interface LogoutButtonProps {
  text: string;
}

export const LogoutButton: FC<LogoutButtonProps> = ({ text }) => {
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.refresh();
    setLoading(false);
  };

  return (
    <Button loading={loading} onClick={signOut}>
      {text}
    </Button>
  );
};
