"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { type Provider } from "@supabase/supabase-js";

import ROUTES from "~/utils/routes";

import { errorHandler } from "../errorHandler";
import { createClient } from "../supabase/server";
import { ErrorsToTranslate } from "../validations/errorsEnums";

export async function providerAuth(provider: Provider) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error?.message);
    }

    revalidateTag("session-user");
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function login(
  captchaToken: string,
  formData: {
    email: string;
    password: string;
  },
) {
  try {
    if (captchaToken === "") {
      throw new Error(ErrorsToTranslate.AUTH.CAPTCHA_WAS_NOT_SOLVED);
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
      options: { captchaToken: captchaToken },
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidateTag("session-user");
    redirect("/profile");
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function demoLogin() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: "test@test.test",
      password: "test",
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidateTag("session-user");
    redirect("/profile");
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function signUp(
  captchaToken: string,
  formData: {
    email: string;
    password: string;
    repeat_password: string;
  },
) {
  try {
    if (captchaToken === "") {
      throw new Error(ErrorsToTranslate.AUTH.CAPTCHA_WAS_NOT_SOLVED);
    }

    if (formData.password !== formData.repeat_password) {
      throw new Error(ErrorsToTranslate.AUTH.PASSWORDS_ARE_NOT_THE_SAME);
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { captchaToken: captchaToken },
    });

    if (error) {
      throw new Error(error?.message);
    }

    revalidateTag("session-user");
    redirect(`${ROUTES.auth.signup}?checkMail=${formData.email}`);
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function signOut() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      throw new Error(error?.message);
    }

    revalidateTag("session-user");
    redirect("/profile");
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}
