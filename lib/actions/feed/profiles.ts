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
  q: z.string().min(2).nullish(),
});

async function getSessionAndUserData(
  variant: "following" | "followers" | null,
  fullname: string | null
) {
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

  return { session, userData };
}

export async function fetchProfiles(
  variant: "followers" | "following" | null,
  fullname: string | null,
  searchParams:
    | {
        orderBy?: string;
        order?: "asc" | "desc";
        page?: string;
        q?: string;
      }
    | undefined
): Promise<ProfileCardDataInterface[]> {
  unstable_noStore();

  try {
    const { orderBy, order, page, q } = ParamsValidator.parse(searchParams);
    const { session, userData } = await getSessionAndUserData(
      variant,
      fullname
    );

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

    const profiles = (await db.profile.findMany({
      take: takeLimit,
      skip: skipItems,
      where: {
        id: !variant && session?.user ? { not: session.user.id } : {},
        full_name: {
          not: null,
          ...(q ? { contains: q, mode: "insensitive" } : {}),
        },
        ...(userData
          ? variant === "followers"
            ? { following: { some: { following_id: userData.id } } }
            : variant === "following"
            ? { followed_by: { some: { follower_id: userData.id } } }
            : { private: { not: true } }
          : { private: { not: true } }),
      },
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
                added_audiobook_at: { not: null },
                added_book_at: { not: null },
                added_ebook_at: { not: null },
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
  fullname: string | null,
  searchParams?: {
    q?: string;
  }
): Promise<number> {
  unstable_noStore();
  try {
    const q = searchParams ? ParamsValidator.parse(searchParams).q : undefined;
    const { session, userData } = await getSessionAndUserData(
      variant,
      fullname
    );

    const profilesCount = await db.profile.count({
      where: {
        id: !variant && session?.user ? { not: session.user.id } : {},
        full_name: {
          not: null,
          ...(q ? { contains: q, mode: "insensitive" } : {}),
        },
        ...(userData
          ? variant === "followers"
            ? { following: { some: { following_id: userData.id } } }
            : variant === "following"
            ? { followed_by: { some: { follower_id: userData.id } } }
            : { private: { not: true } }
          : { private: { not: true } }),
      },
    });

    return profilesCount;
  } catch (error) {
    return 0;
  }
}
