import { createBrowserClient } from "@supabase/ssr";
import { type Provider } from "@supabase/supabase-js";

import { errorHandler } from "../errorHandler";
import { LoginValidator, SignupValidator } from "../validations/auth";
import { ErrorsToTranslate } from "../validations/errorsEnums";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function providerAuth(
  provider: Provider
): Promise<{ success: boolean }> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error?.message);
    }

    return { success: true };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function login(
  captchaToken: string,
  formData: unknown
): Promise<{ success: true }> {
  try {
    if (captchaToken === "") {
      throw new Error(ErrorsToTranslate.AUTH.CAPTCHA_WAS_NOT_SOLVED);
    }

    const validFormData = LoginValidator.parse(formData);

    const { error } = await supabase.auth.signInWithPassword({
      email: validFormData.email,
      password: validFormData.password,
      options: { captchaToken: captchaToken },
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function demoLogin(
  captchaToken: string
): Promise<{ success: true }> {
  try {
    if (captchaToken === "") {
      throw new Error(ErrorsToTranslate.AUTH.CAPTCHA_WAS_NOT_SOLVED);
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: "test@test.test",
      password: "test",
      options: { captchaToken: captchaToken },
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}

export async function signup(
  captchaToken: string,
  formData: unknown
): Promise<{ success: true }> {
  try {
    if (captchaToken === "") {
      throw new Error(ErrorsToTranslate.AUTH.CAPTCHA_WAS_NOT_SOLVED);
    }

    const validFormData = SignupValidator.parse(formData);

    if (validFormData.password !== validFormData.repeat_password) {
      throw new Error(ErrorsToTranslate.AUTH.PASSWORDS_ARE_NOT_THE_SAME);
    }

    const { error } = await supabase.auth.signUp({
      email: validFormData.email,
      password: validFormData.password,
      options: { captchaToken: captchaToken },
    });

    if (error) {
      throw new Error(error?.message);
    }

    return { success: true };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}
