import type { FC } from "react";
import { notFound } from "next/navigation";

import { profilesOrderByArray } from "~/types/feed/OrderVariants";

import { db } from "~/lib/db";
import readUserSession from "~/lib/supabase/readUserSession";

import { FeedWithSorting } from "../Feed/FeedWithSorting";
import { BackCategoryLink } from "../ui/BackCategoryLink";

interface FollowPageProps {
  fullname: string;
  variant: "followers" | "following";
}

export const FollowPage: FC<FollowPageProps> = async ({
  fullname,
  variant,
}) => {
  const {
    data: { session },
  } = await readUserSession();

  const userData = await db.profile.findUnique({
    where: {
      full_name: decodeURIComponent(fullname),
    },
    select: {
      id: true,
      _count: { select: { followed_by: true, following: true } },
    },
  });

  if (!userData) notFound();

  const takeLimit =
    variant === "followers"
      ? userData._count.followed_by
      : userData._count.following;

  return (
    <>
      <BackCategoryLink href={`../${fullname}`} variant="RETURN" />
      <FeedWithSorting
        feedVariant="profiles"
        variant={variant}
        userId={userData.id}
        sessionId={session?.user.id}
        orderArray={profilesOrderByArray}
        takeLimit={takeLimit < 30 ? takeLimit : 30}
      />
    </>
  );
};
