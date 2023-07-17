import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { CreateUsername } from "~/components/Auth/CreateUsername";
import { db } from "~/utils/db";

export default async function CreateFullnamePage() {
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

  if (userData.full_name) {
    redirect(`/${userData.full_name}`);
  } else {
    return (
      <CreateUsername
        avatarSrc={userData.avatar_url}
        email={userExists.email as string}
        createdAt={userData.created_at}
      />
    );
  }
}
