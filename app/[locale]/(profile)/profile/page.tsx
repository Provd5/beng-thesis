import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";
import { createServerClient } from "@supabase/ssr";

import { type localeTypes } from "~/i18n";
import { db } from "~/lib/db";

export default async function CheckUsernamePage({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userData =
    session?.user &&
    (await db.profile.findUnique({
      where: { id: session.user.id },
      select: { full_name: true },
    }));

  if (!userData) notFound();

  userData.full_name
    ? redirect(`/profile/${userData.full_name}`)
    : redirect(`/edit-profile`);
}
