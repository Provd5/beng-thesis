import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { AvatarImage } from "~/components/Profile/AvatarImage";
import { ManageProfileDescription } from "~/components/Profile/EditProfile/ManageProfileDescription";
import { ManageProfileStatus } from "~/components/Profile/EditProfile/ManageProfileStatus";
import { ManageProfileUsername } from "~/components/Profile/EditProfile/ManageProfileUsername";
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
      select: {
        avatar_url: true,
        full_name: true,
        private: true,
        description: true,
      },
    }));

  if (!userData) {
    notFound();
  }

  return (
    <>
      <div className="mb-3 flex gap-1 xs:gap-3">
        <div className="ml-0 mt-[-30px] xs:ml-6">
          <div className="relative flex h-[112px] w-[112px] items-center justify-center rounded-full bg-gradient-light dark:bg-gradient-dark">
            <AvatarImage size="lg" avatarSrc={userData.avatar_url} />
          </div>
        </div>
        <ManageProfileStatus isPrivate={userData.private} />
      </div>
      <div className="flex flex-col gap-5">
        <ManageProfileUsername userFullname={userData.full_name} />
        <ManageProfileDescription userDescription={userData.description} />
      </div>
    </>
  );
}
