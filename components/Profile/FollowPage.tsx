import type { FC } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { profilesOrderByArray } from "~/types/feed/OrderVariants";

import { db } from "~/lib/db";

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
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userData = await db.profile.findUnique({
    where: {
      full_name: fullname,
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
    <div className="mt-6">
      <BackCategoryLink href={`../${fullname}`} variant="RETURN" />
      <FeedWithSorting
        feedVariant="profiles"
        variant={variant}
        userId={userData.id}
        sessionId={session?.user.id}
        orderArray={profilesOrderByArray}
        takeLimit={takeLimit < 30 ? takeLimit : 30}
      />
    </div>
  );
};
