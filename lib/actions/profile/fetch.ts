"use server";

import { unstable_noStore } from "next/cache";

import { db } from "~/lib/db";
import readUserSession from "~/lib/supabase/readUserSession";

export async function fetchPublicUserData(fullname?: string) {
  unstable_noStore();

  let userData = null;

  const {
    data: { session },
  } = await readUserSession();

  const whereClause = fullname
    ? { full_name: fullname }
    : { id: session?.user.id };

  userData = await db.profile.findUnique({
    where: whereClause,
    select: {
      id: true,
      avatar_url: true,
      description: true,
      private: true,
      full_name: true,
      followed_by: true,
      _count: { select: { followed_by: true, following: true } },
    },
  });

  if (userData) {
    const isMyProfile = userData.id === session?.user.id;
    const isFollowed = userData.followed_by.some(
      (follower) => follower.follower_id === session?.user.id
    );

    return { ...userData, isFollowed, isMyProfile };
  }

  return userData;
}
