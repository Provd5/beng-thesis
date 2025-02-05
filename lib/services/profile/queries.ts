"use server";

import { unstable_cache } from "next/cache";

import { type GetProfileInterface } from "~/types/data/profile";
import { type GetDataList } from "~/types/list";
import {
  SortFollowProfilesArray,
  SortProfilesArray,
} from "~/types/orderArrays";
import {
  type SortFollowProfilesType,
  type SortProfilesType,
} from "~/types/sort";

import { db } from "~/lib/db";
import { errorHandler } from "~/lib/errorHandler";
import { profileSelector } from "~/lib/utils/prismaSelectors";
import { totalPages } from "~/lib/utils/totalPages";
import { transformProfileData } from "~/lib/utils/transformProfileData";
import { sortParamsValidator } from "~/utils/sortParamsValidator";

const itemsPerPage = 20;

export const getProfileQuantity = unstable_cache(
  async (q?: string): Promise<number> => {
    try {
      const quantity = await db.profile.count({
        where: {
          private: { not: true },
          full_name: {
            not: null,
            ...(q ? { contains: q, mode: "insensitive" } : {}),
          },
        },
      });

      return quantity;
    } catch (e) {
      throw new Error(errorHandler(e));
    }
  },
  ["profile-quantity"],
  { revalidate: 60 * 60 * 2, tags: ["profile-quantity"] }, // two hours
);

export const getAllProfiles = unstable_cache(
  async (
    sessionId: string | undefined,
    searchParams: unknown,
    q?: string,
  ): Promise<GetDataList<GetProfileInterface>> => {
    const validSearchParams = sortParamsValidator(
      searchParams,
      SortProfilesArray,
    );
    const { order, orderBy: defaultOrderBy, page } = validSearchParams;
    const orderBy = defaultOrderBy as SortProfilesType;

    try {
      const [allItems, profiles] = await Promise.all([
        getProfileQuantity(q),
        db.profile.findMany({
          skip: (page - 1) * itemsPerPage,
          take: itemsPerPage,
          orderBy:
            orderBy === "activity"
              ? [
                  { review: { _count: order } },
                  { review_reaction: { _count: order } },
                  { followed_by: { _count: order } },
                  { following: { _count: order } },
                  { book_owned_as: { _count: order } },
                  { bookshelf: { _count: order } },
                  { liked_book: { _count: order } },
                ]
              : orderBy === "books_on_shelves"
                ? { bookshelf: { _count: order } }
                : orderBy === "followers"
                  ? { followed_by: { _count: order } }
                  : orderBy === "owned_books"
                    ? { book_owned_as: { _count: order } }
                    : orderBy === "reviews"
                      ? { review: { _count: order } }
                      : { [orderBy]: order },
          where: {
            private: { not: true },
            full_name: {
              not: null,
              ...(q ? { contains: q, mode: "insensitive" } : {}),
            },
          },
          include: profileSelector(sessionId),
        }),
      ]);

      const transformedData = profiles.map((profile) =>
        transformProfileData(!!sessionId, profile),
      );

      return {
        page,
        totalPages: totalPages(allItems, itemsPerPage),
        allItems,
        itemsPerPage:
          profiles.length < itemsPerPage ? profiles.length : itemsPerPage,
        data: transformedData,
      };
    } catch (e) {
      throw new Error(errorHandler(e));
    }
  },
  ["all-profiles"],
  { revalidate: 60 * 60 * 2, tags: ["all-profiles"] }, // two hours
);

export const getProfile = unstable_cache(
  async (
    sessionId: string | undefined,
    profileName?: string,
  ): Promise<GetProfileInterface | null> => {
    const decodedProfileName = profileName
      ? decodeURIComponent(profileName)
      : undefined;

    try {
      const profile = await db.profile.findUnique({
        where: decodedProfileName
          ? { full_name: decodedProfileName }
          : { id: sessionId },
        include: profileSelector(sessionId),
      });

      if (!profile) return null;

      const transformedData = transformProfileData(!!sessionId, profile);

      return transformedData;
    } catch (e) {
      throw new Error(errorHandler(e));
    }
  },
  ["profile"],
  { revalidate: 60 * 60 * 2, tags: ["profile"] }, // two hours
);

export const getFollowQuantity = unstable_cache(
  async (
    profileName: string,
    variant: "follower" | "following",
  ): Promise<number> => {
    const decodedProfileName = decodeURIComponent(profileName);

    try {
      const quantity = await db.profile.count({
        where:
          variant === "follower"
            ? {
                following: {
                  some: { following: { full_name: decodedProfileName } },
                },
                full_name: { not: null },
              }
            : {
                followed_by: {
                  some: { follower: { full_name: decodedProfileName } },
                },
                full_name: { not: null },
              },
      });

      return quantity;
    } catch (e) {
      throw new Error(errorHandler(e));
    }
  },
  ["follow-quantity"],
  { revalidate: 60 * 60 * 2, tags: ["follow-quantity"] }, // two hours
);

export const getFollowProfiles = unstable_cache(
  async (
    sessionId: string | undefined,
    profileName: string,
    variant: "follower" | "following",
    searchParams: unknown,
  ): Promise<GetDataList<GetProfileInterface>> => {
    const decodedProfileName = decodeURIComponent(profileName);

    const validSearchParams = sortParamsValidator(
      searchParams,
      SortFollowProfilesArray,
    );
    const { order, orderBy: defaultOrderBy, page } = validSearchParams;
    const orderBy = defaultOrderBy as SortFollowProfilesType;

    try {
      const [allItems, profiles] = await Promise.all([
        getFollowQuantity(decodedProfileName, variant),
        db.follows.findMany({
          skip: (page - 1) * itemsPerPage,
          take: itemsPerPage,
          orderBy:
            orderBy === "activity"
              ? [
                  { [variant]: { review: { _count: order } } },
                  { [variant]: { review_reaction: { _count: order } } },
                  { [variant]: { followed_by: { _count: order } } },
                  { [variant]: { following: { _count: order } } },
                  { [variant]: { book_owned_as: { _count: order } } },
                  { [variant]: { bookshelf: { _count: order } } },
                  { [variant]: { liked_book: { _count: order } } },
                ]
              : orderBy === "books_on_shelves"
                ? { [variant]: { bookshelf: { _count: order } } }
                : orderBy === "followers"
                  ? { [variant]: { followed_by: { _count: order } } }
                  : orderBy === "owned_books"
                    ? { [variant]: { book_owned_as: { _count: order } } }
                    : orderBy === "reviews"
                      ? { [variant]: { review: { _count: order } } }
                      : orderBy === "last_added"
                        ? { updated_at: order }
                        : { [variant]: { [orderBy]: order } },
          where:
            variant === "follower"
              ? {
                  following: { full_name: decodedProfileName },
                  follower: { full_name: { not: null } },
                }
              : {
                  follower: { full_name: decodedProfileName },
                  following: { full_name: { not: null } },
                },
          select: {
            [variant]: {
              include: profileSelector(sessionId),
            },
          },
        }),
      ]);

      const transformedData = profiles.map((profile) =>
        transformProfileData(!!sessionId, profile[variant]),
      );

      return {
        page,
        totalPages: totalPages(allItems, itemsPerPage),
        allItems,
        itemsPerPage:
          profiles.length < itemsPerPage ? profiles.length : itemsPerPage,
        data: transformedData,
      };
    } catch (e) {
      throw new Error(errorHandler(e));
    }
  },
  ["follow-profiles"],
  { revalidate: 60 * 60 * 2, tags: ["follow-profiles"] }, // two hours
);
