import { type User } from "@supabase/supabase-js";

import { type GetProfileInterface } from "~/types/data/profile";

import { db } from "../db";
import { errorHandler } from "../errorHandler";
import { createClient } from "../supabase/server";
import { unstable_cache } from "../unstable-cache";
import { profileSelector } from "../utils/prismaSelectors";
import { transformProfileData } from "../utils/transformProfileData";

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
