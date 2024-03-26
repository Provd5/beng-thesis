import { createBrowserClient } from "@supabase/ssr";
import { type Provider } from "@supabase/supabase-js";

import { errorHandler } from "../errorHandler";
import { LoginValidator, SignupValidator } from "../validations/auth";
import { ErrorsToTranslate } from "../validations/errorsEnums";

export class AuthService {
  private supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async providerAuth(provider: Provider): Promise<Response> {
    try {
      const { error } = await this.supabase.auth.signInWithOAuth({
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
      throw new Error(errorHandler(e));
    }
  }

  async login(captchaToken: string, formData: unknown): Promise<Response> {
    try {
      if (captchaToken === "") {
        throw new Error(ErrorsToTranslate.AUTH.CAPTCHA_WAS_NOT_SOLVED);
      }

      const validFormData = LoginValidator.parse(formData);

      const { error } = await this.supabase.auth.signInWithPassword({
        email: validFormData.email,
        password: validFormData.password,
        options: { captchaToken: captchaToken },
      });

      if (error) {
        throw new Error(error.message);
      }

      return new Response();
    } catch (e) {
      throw new Error(errorHandler(e));
    }
  }

  async signup(captchaToken: string, formData: unknown): Promise<Response> {
    try {
      if (captchaToken === "") {
        throw new Error(ErrorsToTranslate.AUTH.CAPTCHA_WAS_NOT_SOLVED);
      }

      const validFormData = SignupValidator.parse(formData);

      if (validFormData.password !== validFormData.repeat_password) {
        throw new Error(ErrorsToTranslate.AUTH.PASSWORDS_ARE_NOT_THE_SAME);
      }

      const { error } = await this.supabase.auth.signUp({
        email: validFormData.email,
        password: validFormData.password,
        options: { captchaToken: captchaToken },
      });

      if (error) {
        throw new Error(error?.message);
      }

      return new Response();
    } catch (e) {
      throw new Error(errorHandler(e));
    }
  }
}
