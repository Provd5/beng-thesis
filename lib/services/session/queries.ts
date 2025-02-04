"use server";

import { type User } from "@supabase/supabase-js";

import { type GetProfileInterface } from "~/types/data/profile";

import { db } from "~/lib/db";
import { errorHandler } from "~/lib/errorHandler";
import { createClient } from "~/lib/supabase/server";
import { unstable_cache } from "~/lib/unstable-cache";
import { profileSelector } from "~/lib/utils/prismaSelectors";
import { transformProfileData } from "~/lib/utils/transformProfileData";

export const getSessionUser = async (): Promise<User | null> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch (e) {
    throw new Error(errorHandler(e));
  }
};

export const getSessionUserDetails = unstable_cache(
  async (
    sessionId: string | undefined,
  ): Promise<GetProfileInterface | null> => {
    try {
      const profile =
        sessionId &&
        (await db.profile.findUnique({
          where: { id: sessionId },
          include: profileSelector(sessionId),
        }));

      if (!profile) return null;

      const transformedData = transformProfileData(!!sessionId, profile);

      return transformedData;
    } catch (e) {
      throw new Error(errorHandler(e));
    }
  },
  ["session-user"],
  { revalidate: 60 * 60 * 2 }, // two hours
);
