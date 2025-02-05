"use server";

import { type User } from "@supabase/supabase-js";

import { errorHandler } from "~/lib/errorHandler";
import { createClient } from "~/lib/supabase/server";

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
