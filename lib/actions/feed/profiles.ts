"use server";

import { unstable_noStore } from "next/cache";
import { z } from "zod";

import { PROFILES_FEED_TAKE_LIMIT } from "~/types/feed/TakeLimits";

import { db } from "~/lib/db";
import readUserSession from "~/lib/supabase/readUserSession";

const ParamsValidator = z.object({
  orderBy: z
    .enum([
      "profile_traffic",
      "book_owned_as",
      "bookshelf",
      "followed_by",
      "review",
      "full_name",
    ])
    .nullish(),
  order: z.enum(["asc", "desc"]).nullish(),
  page: z.string().nullish(),
});

export async function fetchProfiles(
  variant: "followers" | "following" | null,
  fullname: string | null,
  searchParams:
    | {
        orderBy?: string;
        order?: "asc" | "desc";
        page?: string;
      }
    | undefined
): Promise<ProfileCardDataInterface[]> {
  unstable_noStore();

  try {
    const { orderBy, order, page } = ParamsValidator.parse(searchParams);

    const takeLimit = PROFILES_FEED_TAKE_LIMIT;
    const parsedPage = page ? parseInt(page) : 1;
    const skipItems = (parsedPage - 1) * takeLimit;
    const defaultOrder = order || "desc";

    let orderByClause = null;
    switch (orderBy) {
      case "full_name":
        orderByClause = { [orderBy]: defaultOrder };
        break;
      case "book_owned_as":
      case "bookshelf":
      case "followed_by":
      case "review":
        orderByClause = { [orderBy]: { _count: defaultOrder } };
        break;
      case "profile_traffic":
      default:
        orderByClause = [
          { review: { _count: defaultOrder } },
          { review_reaction: { _count: defaultOrder } },
          { followed_by: { _count: defaultOrder } },
          { following: { _count: defaultOrder } },
          { book_owned_as: { _count: defaultOrder } },
          { bookshelf: { _count: defaultOrder } },
          { liked_book: { _count: defaultOrder } },
        ];
        break;
    }

    const {
      data: { session },
    } = !variant ? await readUserSession() : { data: { session: null } };

    const userData =
      !!variant && !!fullname
        ? await db.profile.findUnique({
            where: { full_name: fullname },
            select: { id: true },
          })
        : null;

    const whereClause = {
      id: !variant && session?.user ? { not: session.user.id } : {},
      full_name: { not: null },
      ...(userData
        ? variant === "followers"
          ? { following: { some: { following_id: userData.id } } }
          : variant === "following"
          ? { followed_by: { some: { follower_id: userData.id } } }
          : { private: { not: true } }
        : { private: { not: true } }),
    };

    const profiles = (await db.profile.findMany({
      take: takeLimit,
      skip: skipItems,
      where: whereClause,
      orderBy: orderByClause,
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
            liked_book: true,
            followed_by: true,
            book_owned_as: {
              where: {
                NOT: {
                  AND: [
                    { added_audiobook_at: null },
                    { added_book_at: null },
                    { added_ebook_at: null },
                  ],
                },
              },
            },
          },
        },
      },
    })) as ProfileCardDataInterface[];

    return profiles;
  } catch (error) {
    return [];
  }
}

export async function fetchProfilesCount(
  variant: "followers" | "following" | null,
  fullname: string | null
) {
  unstable_noStore();

  const {
    data: { session },
  } = !variant ? await readUserSession() : { data: { session: null } };

  const userData =
    !!variant && !!fullname
      ? await db.profile.findUnique({
          where: { full_name: fullname },
          select: { id: true },
        })
      : null;

  const whereClause = {
    id: !variant && session?.user ? { not: session.user.id } : {},
    full_name: { not: null },
    ...(userData
      ? variant === "followers"
        ? { following: { some: { following_id: userData.id } } }
        : variant === "following"
        ? { followed_by: { some: { follower_id: userData.id } } }
        : { private: { not: true } }
      : { private: { not: true } }),
  };

  const profilesCount = await db.profile.count({
    where: whereClause,
  });

  return profilesCount;
}
