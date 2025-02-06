"use server";

import { type User } from "@supabase/supabase-js";

import { createClient } from "~/lib/supabase/server";

export const getSessionUser = async (): Promise<User | null> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch (e) {
    return null;
  }
};
