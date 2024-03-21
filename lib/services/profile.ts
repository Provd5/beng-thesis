"use server";

import { type ReadonlyURLSearchParams } from "next/navigation";

import {
  type FollowsInterface,
  type GetProfileInterface,
} from "~/types/data/profile";
import { type GetDataList } from "~/types/list";
import { SortBooksArray } from "~/types/orderArrays";
import {
  type SortFollowProfilesType,
  type SortProfilesType,
} from "~/types/sort";

import { sortParamsValidator } from "~/utils/sortParamsValidator";

import { db } from "../db";
import readUserSession from "../supabase/readUserSession";
import { AuthErrors, GlobalErrors } from "../validations/errorsEnums";
import {
  EditProfileValidator,
  FollowProfileValidator,
} from "../validations/profile";

export class ProfileService {
  private itemsPerPage = 20;
  private totalPages = (allItems: number) =>
    Math.ceil(allItems / this.itemsPerPage);

  private profileSelector = {
    _count: {
      select: {
        followed_by: true,
        following: true,
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
        bookshelf: true,
        liked_book: true,
        review: true,
      },
    },
  };

  async getQuantity(q?: string): Promise<number> {
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
      throw new Error(`Error while fetching profiles quantity.`);
    }
  }

  async getAllProfiles(
    searchParams: ReadonlyURLSearchParams,
    q?: string
  ): Promise<GetDataList<GetProfileInterface>> {
    const validSearchParams = sortParamsValidator(searchParams, SortBooksArray);
    const { order, orderBy: defaultOrderBy, page } = validSearchParams;
    const orderBy = defaultOrderBy as SortProfilesType;

    try {
      const allItems = await this.getQuantity(q);
      const profiles = await db.profile.findMany({
        skip: (page - 1) * this.itemsPerPage,
        take: this.itemsPerPage,
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
        include: this.profileSelector,
      });

      if (!(profiles.length > 0)) throw new Error("No profiles data.");

      return {
        page,
        totalPages: this.totalPages(allItems),
        allItems,
        itemsPerPage:
          profiles.length < this.itemsPerPage
            ? profiles.length
            : this.itemsPerPage,
        data: profiles,
      };
    } catch (e) {
      throw new Error(`Error while fetching profiles. ${e as string}`);
    }
  }

  async getSessionProfile(): Promise<GetProfileInterface | null> {
    try {
      const {
        data: { session },
      } = await readUserSession();

      const profile =
        session &&
        (await db.profile.findUnique({
          where: { id: session.user.id },
          include: this.profileSelector,
        }));

      return profile;
    } catch (e) {
      throw new Error(`Error while fetching profile. ${e as string}`);
    }
  }

  async getProfile(profileName: string): Promise<GetProfileInterface> {
    try {
      const profile = await db.profile.findUnique({
        where: { full_name: profileName },
        include: this.profileSelector,
      });

      if (!profile) throw new Error("No profile data.");

      return profile;
    } catch (e) {
      throw new Error(`Error while fetching profile. ${e as string}`);
    }
  }

  async getProfileFromId(profileId: string): Promise<GetProfileInterface> {
    try {
      const profile = await db.profile.findUnique({
        where: { id: profileId },
        include: this.profileSelector,
      });

      if (!profile) throw new Error("No profile data.");

      return profile;
    } catch (e) {
      throw new Error(`Error while fetching profile. ${e as string}`);
    }
  }

  async getFollowQuantity(
    profileName: string,
    variant: "followers" | "following"
  ): Promise<number> {
    try {
      const quantity = await db.profile.count({
        where:
          variant === "followers"
            ? {
                following: { some: { following: { full_name: profileName } } },
                full_name: { not: null },
              }
            : {
                followed_by: { some: { follower: { full_name: profileName } } },
                full_name: { not: null },
              },
      });

      return quantity;
    } catch (e) {
      throw new Error(`Error while fetching ${variant} quantity.`);
    }
  }

  async getFollowProfiles(
    profileName: string,
    variant: "followers" | "following",
    searchParams: ReadonlyURLSearchParams
  ): Promise<GetDataList<GetProfileInterface>> {
    const validSearchParams = sortParamsValidator(searchParams, SortBooksArray);
    const { order, orderBy: defaultOrderBy, page } = validSearchParams;
    const orderBy = defaultOrderBy as SortFollowProfilesType;

    try {
      const [allItems, profiles] = await Promise.all([
        this.getFollowQuantity(profileName, variant),
        db.follows.findMany({
          skip: (page - 1) * this.itemsPerPage,
          take: this.itemsPerPage,
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
          where: {
            [variant]: { full_name: profileName },
          },
          select: {
            [variant]: {
              include: this.profileSelector,
            },
          },
        }),
      ]);

      return {
        page,
        totalPages: this.totalPages(allItems),
        allItems,
        itemsPerPage:
          profiles.length < this.itemsPerPage
            ? profiles.length
            : this.itemsPerPage,
        data: profiles.map((profile) => profile.variant),
      };
    } catch (e) {
      throw new Error(`Error while fetching ${variant} profiles.`);
    }
  }

  async getFollowData(
    userId: string
  ): Promise<FollowsInterface | null | undefined> {
    try {
      const {
        data: { session },
      } = await readUserSession();

      if (!session) return undefined;

      const follow = await db.follows.findFirst({
        where: {
          follower: { id: session.user.id },
          following: { full_name: userId },
        },
      });

      return follow;
    } catch (e) {
      throw new Error(`Error while fetching books.`);
    }
  }

  async postFollow(profileId: unknown): Promise<Response> {
    try {
      const {
        data: { session },
      } = await readUserSession();

      if (!session?.user) {
        throw new Error(GlobalErrors.UNAUTHORIZED);
      }

      const validProfileId = FollowProfileValidator.parse({ profileId });
      if (session.user.id === validProfileId.profileId) {
        throw new Error("Cannot follow your own profile");
      }

      const alreadyFollowed = await db.follows.findFirst({
        where: {
          follower: { id: session.user.id },
          following: { id: validProfileId.profileId },
        },
      });

      if (alreadyFollowed) {
        await db.follows.delete({
          where: {
            follower_id_following_id: {
              follower_id: session.user.id,
              following_id: validProfileId.profileId,
            },
          },
        });
      } else {
        await db.follows.create({
          data: {
            follower_id: session.user.id,
            following_id: validProfileId.profileId,
          },
        });
      }

      // on success
      return new Response();
    } catch (error) {
      throw new Error(GlobalErrors.SOMETHING_WENT_WRONG);
    }
  }

  async editProfile(formData: unknown): Promise<Response> {
    try {
      const {
        data: { session },
      } = await readUserSession();

      if (!session?.user) {
        throw new Error(GlobalErrors.UNAUTHORIZED);
      }

      const validFormData = EditProfileValidator.parse({ formData });
      const isUsernameExists = await db.profile.count({
        where: {
          full_name: { equals: validFormData.username, mode: "insensitive" },
          id: { not: session.user.id },
        },
      });

      if (isUsernameExists) {
        throw new Error(AuthErrors.USERNAME_EXISTS);
      }

      await db.profile.update({
        where: {
          id: session.user.id,
        },
        data: {
          full_name: validFormData.username,
          description: validFormData.description,
          private: validFormData.private,
        },
      });

      // on success
      return new Response();
    } catch (error) {
      throw new Error(GlobalErrors.SOMETHING_WENT_WRONG);
    }
  }
}
