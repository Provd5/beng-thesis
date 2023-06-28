import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { AuthForm } from "~/app/components/AuthForm";

export default async function LoginPage() {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex w-full max-w-sm flex-1 flex-col justify-center gap-2">
      <AuthForm view="logIn" />
    </div>
  );
}
