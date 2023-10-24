import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { ProfileCard } from "~/components/Explore/ProfileCard";
import { db } from "~/lib/db";

import { BackCategoryLink } from "../ui/BackCategoryLink";

export default async function FollowPage({
  variant,
  fullname,
}: {
  variant: "following" | "followers";
  fullname: string;
}) {
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
    },
  });

  if (!userData || (variant !== "following" && variant !== "followers")) {
    notFound();
  }

  const profilesData = await db.profile.findMany({
    where: {
      id: { not: userData.id },
      full_name: { not: null },
      ...(variant === "followers"
        ? { following: { some: { following_id: userData.id } } }
        : { followed_by: { some: { follower_id: userData.id } } }),
    },
    select: {
      id: true,
      full_name: true,
      avatar_url: true,
      description: true,
      created_at: true,
      followed_by: {
        select: { follower_id: true },
      },
      _count: {
        select: {
          bookshelf: { where: { bookshelf: "ALREADY_READ" } },
          review: true,
          followed_by: true,
          book_owned_as: true,
          liked_book: true,
        },
      },
    },
  });

  const doIAlreadyFollow = (
    followedBy: {
      follower_id: string;
    }[]
  ) => {
    return followedBy.some(
      (follower) => follower.follower_id === session?.user.id
    );
  };

  return (
    <div className="mt-6">
      <BackCategoryLink href={`../${fullname}`} variant="RETURN" />
      <div className="mt-3 flex grid-cols-1 flex-col items-center gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {profilesData.map((profile) => (
          <ProfileCard
            key={profile.id}
            id={profile.id}
            fullName={profile.full_name as string}
            avatarUrl={profile.avatar_url}
            bookshelfQuantity={profile._count.bookshelf}
            reviewsQuantity={profile._count.review}
            likedBooksQuantity={profile._count.liked_book}
            OwnedAsQuantity={profile._count.book_owned_as}
            followedByQuantity={profile._count.followed_by}
            description={profile.description}
            isFollowed={doIAlreadyFollow(profile.followed_by)}
          />
        ))}
      </div>
    </div>
  );
}
