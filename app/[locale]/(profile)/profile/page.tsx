import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { db } from "~/lib/db";

export default async function CheckUsernamePage() {
  const supabase = createServerComponentClient({
    cookies,
  });

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
