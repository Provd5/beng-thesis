"use server";

import { unstable_noStore } from "next/cache";

import { type CategoryTypes } from "~/types/CategoryTypes";

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

export async function fetchCategoryCount(
  type: CategoryTypes | null,
  fullname: string | null
) {
  unstable_noStore();

  const getCount = async (category: CategoryTypes | null) => {
    switch (category) {
      case "STATISTICS":
        return 0;
      case null:
        return db.book.count();
      case "LIKED":
        return db.liked_books.count({
          where: {
            profile: { full_name: fullname },
          },
        });
      case "REVIEWS":
        return db.review.count({
          where: {
            profile: { full_name: fullname },
          },
        });
      case "OWNED":
        return db.book_owned_as.count({
          where: {
            profile: { full_name: fullname },
            added_audiobook_at: { not: null },
            added_book_at: { not: null },
            added_ebook_at: { not: null },
          },
        });
      default:
        return db.bookshelf.count({
          where: {
            profile: { full_name: fullname },
            bookshelf: category,
          },
        });
    }
  };

  const categoryCount = await getCount(type);
  return categoryCount;
}
