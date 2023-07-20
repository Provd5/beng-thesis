import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { CreateUsername } from "~/components/Auth/CreateUsername";
import { AvatarImage } from "~/components/Profile/AvatarImage";
import { ProfileStatus } from "~/components/Profile/ProfileStatus";
import { ProfilePageContainer } from "~/components/ui/PageContainer";
import { db } from "~/lib/db";

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

  return (
    <ProfilePageContainer>
      <div className="container mx-auto pb-3">
        <section className="mb-6 flex gap-3">
          <div className="ml-8 mt-[-30px]">
            <div className="relative flex h-[112px] w-[112px] items-center justify-center rounded-full bg-gradient-light dark:bg-gradient-dark">
              <AvatarImage size="lg" avatarSrc={userData.avatar_url} />
              <ProfileStatus isPrivate={userData.private} />
            </div>
          </div>
          <div>
            <h1 className="mx-0.5 my-2 bg-gradient-dark bg-clip-text text-xl font-semibold text-transparent dark:bg-gradient-light">
              {userData.full_name}
            </h1>
          </div>
        </section>
      </div>
      <CreateUsername
        avatarSrc={userData.avatar_url}
        email={userExists.email as string}
        createdAt={userData.created_at}
        fullName={userData.full_name}
      />
    </ProfilePageContainer>
  );
}
