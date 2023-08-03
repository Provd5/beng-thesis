import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { CreateUsername } from "~/components/Auth/CreateUsername";
import { EditProfileData } from "~/components/Profile/EditProfileData";
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
    (await db.profile.findFirst({
      where: { id: session.user.id },
      select: { full_name: true, avatar_url: true, created_at: true },
    }));

  if (!userData) {
    notFound();
  }

  if (userData.full_name) redirect(`/profile/${userData.full_name}`);
  else
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="relative mb-10 flex h-full max-w-sm flex-col items-center justify-center gap-6 px-3 py-6 text-sm text-white-light">
          <EditProfileData
            avatarUrl={userData.avatar_url}
            email={session.user.email}
            createdAt={userData.created_at}
            provider={session.user.app_metadata.provider}
          />
          <CreateUsername fullName={userData.full_name} />
        </div>
      </div>
    );
}
