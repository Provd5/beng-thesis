import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { db } from "~/lib/db";

export default async function CheckUsernamePage() {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userExists = session?.user;

  if (!userExists) {
    redirect(`/login`);
  }

  const userData = await db.profile.findFirst({
    where: { id: userExists.id },
  });

  if (!userData) {
    redirect(`/login`);
  }

  if (userData.full_name) redirect(`/profile/${userData.full_name}`);
  else redirect(`/edit/username`);
}
