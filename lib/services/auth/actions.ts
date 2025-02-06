"use server";

import { redirect } from "next/navigation";
import { type Provider } from "@supabase/supabase-js";

import { LoginValidator, SignupValidator } from "~/lib/validations/auth";
import ROUTES from "~/utils/routes";

import { errorHandler } from "../../errorHandler";
import { createClient } from "../../supabase/server";
import { ErrorsToTranslate } from "../../validations/errorsEnums";

export async function providerAuth(provider: Provider) {
  let dataUrl: string;
  try {
    const origin = process.env.SITE_URL!;
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error?.message);
    }

    dataUrl = data.url;
  } catch (e) {
    throw new Error(errorHandler(e));
  }

  if (dataUrl) {
    redirect(dataUrl);
  }
}

export async function login(captchaToken: string, formData: unknown) {
  try {
    const validData = LoginValidator.parse(formData);

    const supabase = await createClient();
    if (captchaToken === "") {
      throw new Error(ErrorsToTranslate.AUTH.CAPTCHA_WAS_NOT_SOLVED);
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: validData.email,
      password: validData.password,
      options: { captchaToken: captchaToken },
    });

    if (error) {
      throw new Error(error.message);
    }
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
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function signUp(captchaToken: string, formData: unknown) {
  let email = "";

  try {
    const validData = SignupValidator.parse(formData);
    email = validData.email;

    if (validData.password !== validData.repeat_password) {
      throw new Error(ErrorsToTranslate.AUTH.PASSWORDS_ARE_NOT_THE_SAME);
    }

    const supabase = await createClient();
    if (captchaToken === "") {
      throw new Error(ErrorsToTranslate.AUTH.CAPTCHA_WAS_NOT_SOLVED);
    }
    const { error } = await supabase.auth.signUp({
      email: validData.email,
      password: validData.password,
      options: { captchaToken: captchaToken },
    });

    if (error) {
      throw new Error(error?.message);
    }
  } catch (e) {
    throw new Error(errorHandler(e));
  }

  if (email !== "") redirect(`${ROUTES.auth.signup}?checkMail=${email}`);
}

export async function signOut() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      throw new Error(error?.message);
    }
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}
