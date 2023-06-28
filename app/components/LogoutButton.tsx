"use client";

import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Button } from "./ui/Button";

export default function LogoutButton() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return <Button onClick={signOut}>Logout</Button>;
}
