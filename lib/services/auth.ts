"use server";

import { revalidatePath } from "next/cache";
import { type Provider } from "@supabase/supabase-js";

import ROUTES from "~/utils/routes";

import createSupabaseServerClient from "../supabase/server";
import { LoginValidator, SignupValidator } from "../validations/auth";
import { AuthErrors } from "../validations/errorsEnums";

export class AuthService {
  async providerAuth(provider: Provider): Promise<Response> {
    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        throw new Error(error?.message);
      }

      return new Response();
    } catch (e) {
      throw new Error(
        `Error on external authentication provider. ${e as string}`
      );
    }
  }

  async login(captchaToken: string, formData: unknown): Promise<Response> {
    try {
      const validFormData = LoginValidator.parse({ formData });

      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: validFormData.email,
        password: validFormData.password,
        options: { captchaToken: captchaToken },
      });

      if (error) {
        throw new Error(error?.message);
      }

      revalidatePath(ROUTES.profile.session_profile);
      return new Response();
    } catch (e) {
      throw new Error(`Error while logging in. ${e as string}`);
    }
  }

  async signup(captchaToken: string, formData: unknown): Promise<Response> {
    try {
      const validFormData = SignupValidator.parse({ formData });

      if (validFormData.password !== validFormData.repeat_password) {
        throw new Error(AuthErrors.NOT_THE_SAME_PASSWORDS);
      }

      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.signUp({
        email: validFormData.email,
        password: validFormData.password,
        options: { captchaToken: captchaToken },
      });

      if (error) {
        throw new Error(error?.message);
      }

      revalidatePath(ROUTES.profile.session_profile);
      return new Response();
    } catch (e) {
      throw new Error(`Error while signing up. ${e as string}`);
    }
  }
}
