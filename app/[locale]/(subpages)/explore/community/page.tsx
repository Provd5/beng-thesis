import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { ProfileCard } from "~/components/Explore/ProfileCard";
import { db } from "~/lib/db";

export default async function CommunityPage() {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const profilesData = await db.profile.findMany({
    where: {
      private: { not: true },
      full_name: { not: null },
      id: { not: session?.user.id },
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
    <div className="container py-6">
      <div className="flex grid-cols-1 flex-col items-center gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-3">
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
