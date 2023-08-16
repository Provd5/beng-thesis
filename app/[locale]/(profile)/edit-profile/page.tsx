import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { CreateUsername } from "~/components/Auth/CreateUsername";
import { AvatarImage } from "~/components/Profile/AvatarImage";
import { ProfileStatus } from "~/components/Profile/ProfileStatus";
import { db } from "~/lib/db";

export default async function EditProfilePage() {
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
      select: { avatar_url: true, full_name: true, private: true },
    }));

  if (!userData) {
    notFound();
  }

  return (
    <>
      <div className="flex gap-1 xs:gap-3">
        <div className="ml-0 mt-[-30px] xs:ml-6">
          <div className="relative flex h-[112px] w-[112px] items-center justify-center rounded-full bg-gradient-light dark:bg-gradient-dark">
            <AvatarImage size="lg" avatarSrc={userData.avatar_url} />
            <ProfileStatus isPrivate={userData.private} />
          </div>
        </div>
        <div>
          <h1 className="mx-0.5 my-2 break-all bg-gradient-dark bg-clip-text text-xl font-semibold text-transparent dark:bg-gradient-light">
            {userData.full_name}
          </h1>
        </div>
      </div>

      <CreateUsername fullName={userData.full_name} />
    </>
  );
}
