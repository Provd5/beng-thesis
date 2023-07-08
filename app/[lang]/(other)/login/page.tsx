import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { AuthPage } from "~/components/Auth/AuthPage";
import { type Locale } from "~/dictionaries";

export default async function LoginPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect(`/`);
  }

  return <AuthPage params={params} view="logIn" />;
}
