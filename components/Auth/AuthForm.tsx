"use client";

import {
  type Dispatch,
  type FC,
  type FormEvent,
  type SetStateAction,
  useRef,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { type Provider } from "@supabase/supabase-js";
import { z } from "zod";

import { LoginValidator, SignupValidator } from "~/lib/validations/auth";
import {
  AuthErrors,
  GlobalErrors,
  SupabaseValidatorErrors,
} from "~/lib/validations/errorsEnums";

import { ButtonWhite } from "../ui/Buttons";
import { Input } from "../ui/Input";
import { Providers } from "./Providers";

interface AuthFormProps {
  view: "logIn" | "signUp";
  setCheckMail: Dispatch<SetStateAction<string | undefined>>;
}

export const AuthForm: FC<AuthFormProps> = ({ view, setCheckMail }) => {
  const t = useTranslations("Profile.Auth");
  const te = useTranslations("Errors");
  const supabase = createClientComponentClient();

  const router = useRouter();

  const [loginByEmail, setLoginByEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const captcha = useRef<HCaptcha>(null);
  const [captchaToken, setCaptchaToken] = useState("");

  const handleProviderLogin = async (providerType: Provider) => {
    setIsLoading(true);

    try {
      await supabase.auth.signInWithOAuth({
        provider: providerType,
        options: {
          redirectTo: `${location.origin}/api/auth/callback`,
        },
      });
    } catch (error) {
      toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const form = event.currentTarget as HTMLFormElement;
      const email = form.elements.namedItem("email") as HTMLInputElement;
      const password = form.elements.namedItem("password") as HTMLInputElement;

      LoginValidator.parse({
        formData: {
          email: email.value,
          password: password.value,
        },
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });

      error?.message.includes(SupabaseValidatorErrors.LOGIN_ERROR) &&
        toast.error(te("LOGIN_ERROR"));
      error?.message.includes(SupabaseValidatorErrors.EMAIL_NOT_CONFIRMED) &&
        toast.error(te("EMAIL_NOT_CONFIRMED"));

      //on success
      data.user && router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(te(error.issues[0].message));
      } else {
        toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const form = event.currentTarget as HTMLFormElement;
      const email = form.elements.namedItem("email") as HTMLInputElement;
      const password = form.elements.namedItem("password") as HTMLInputElement;
      const passwordRepeat = form.elements.namedItem(
        "password-repeat"
      ) as HTMLInputElement;

      if (password.value !== passwordRepeat.value) {
        toast.error(te(AuthErrors.NOT_THE_SAME_PASSWORDS));
        return;
      }

      SignupValidator.parse({
        formData: {
          email: email.value,
          password: password.value,
        },
      });

      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
          captchaToken: captchaToken,
          emailRedirectTo: `${location.origin}/api/auth/callback`,
        },
      });

      error?.message.includes(SupabaseValidatorErrors.DISABLED_SIGNUPS_ERROR) &&
        toast.error(te("DISABLED_SIGNUPS_ERROR"));
      error?.message.includes(SupabaseValidatorErrors.EMAIL_LINK_ERROR) &&
        toast.error(te("EMAIL_LINK_ERROR"));
      error?.message.includes(SupabaseValidatorErrors.TOKEN_ERROR) &&
        toast.error(te("TOKEN_ERROR"));

      if (!error && !data.user?.identities?.length) {
        toast.error(te(AuthErrors.EMAIL_EXISTS));
        return;
      }

      //on success
      !error && data.user && setCheckMail(data.user.email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(te(error.issues[0].message), { duration: 7000 });
      } else {
        toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
      }
    } finally {
      captcha.current?.resetCaptcha();
      setIsLoading(false);
    }
  };

  const demoLogin = async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email: "123@123.pl",
      password: "1234567890",
    });

    data.user && router.refresh();
  };

  return (
    <>
      <button className="absolute bottom-3 right-3 text-xs" onClick={demoLogin}>
        demo
      </button>
      {/* ^^^^^^^^^^^^^^^^ temp ^^^^^^^^^^^^^^^^ */}
      {!loginByEmail ? (
        <Providers
          handleProviderLogin={handleProviderLogin}
          setLoginByEmail={setLoginByEmail}
          view={view}
        />
      ) : (
        <>
          <form
            className="flex max-w-sm flex-1 flex-col items-center justify-center justify-center gap-1"
            onSubmit={view === "logIn" ? handleLogIn : handleSignUp}
          >
            <Input
              className="w-64"
              loading={isLoading}
              label={t("email:")}
              id="email-input"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="✉️"
              required
            />
            <Input
              className="w-64"
              loading={isLoading}
              label={t("password:")}
              id="password-input"
              type="password"
              name="password"
              placeholder="🔐"
              required
            />
            {view === "signUp" && (
              <Input
                className="w-64"
                loading={isLoading}
                label={t("repeat password:")}
                id="password-repeat-input"
                type="password"
                name="password-repeat"
                placeholder="🔒"
                required
              />
            )}
            <div className="mt-1 overflow-hidden rounded-sm">
              <HCaptcha
                ref={captcha}
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY as string}
                onVerify={(token) => {
                  setCaptchaToken(token);
                }}
              />
            </div>
            {/* <Link className="underline" href={"/"}>
              {t("forgot your password?")}
            </Link> */}
            <ButtonWhite
              loading={isLoading}
              type="submit"
              className="my-5 uppercase"
            >
              {t(view)}
            </ButtonWhite>
          </form>
          <button
            className="font-semibold underline"
            onClick={() => setLoginByEmail(false)}
          >
            {t("logIn/signUp with provider", { view })}
          </button>
        </>
      )}
    </>
  );
};
