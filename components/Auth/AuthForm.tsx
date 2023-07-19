"use client";

import { type FC, type FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { type Provider } from "@supabase/supabase-js";
import { z } from "zod";

import { LoginValidator, SignupValidator } from "~/utils/validations/auth";
import { AuthValidationErrors } from "~/utils/validations/errorsEnums";

import { ButtonWhite } from "../ui/Buttons";
import { Input } from "../ui/Input";

interface AuthFormProps {
  view: "logIn" | "signUp";
}

export const AuthForm: FC<AuthFormProps> = ({ view }) => {
  const t = useTranslations("Auth");
  const te = useTranslations("AuthErrors");
  const supabase = createClientComponentClient();

  const router = useRouter();

  const [checkMail, setCheckMail] = useState<string>();
  const [loginByEmail, setLoginByEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const Providers: Provider[] = ["discord", "google", "github"];

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
      toast.error(te("something_went_wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogIn = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
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

      error?.message.includes(AuthValidationErrors.login_error) &&
        toast.error(te("login_error"));
      error?.message.includes(AuthValidationErrors.email_not_confirmed) &&
        toast.error(te("email_not_confirmed"));

      //on success
      data.user && router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.map((error) => {
          error.message === AuthValidationErrors.wrong_email &&
            toast.error(te("wrong_email"));
          error.message === AuthValidationErrors.password_required_error &&
            toast.error(te("password_required_error"));
        });
      } else {
        toast.error(te("something_went_wrong"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();

    try {
      const form = event.currentTarget as HTMLFormElement;
      const email = form.elements.namedItem("email") as HTMLInputElement;
      const password = form.elements.namedItem("password") as HTMLInputElement;
      const passwordRepeat = form.elements.namedItem(
        "password-repeat"
      ) as HTMLInputElement;

      if (password.value !== passwordRepeat.value) {
        toast.error(te("not_the_same_passwords"));
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
          emailRedirectTo: `${location.origin}/api/auth/callback`,
        },
      });

      error?.message.includes(AuthValidationErrors.disabled_signups_error) &&
        toast.error(te("disabled_signups_error"));
      error?.message.includes(AuthValidationErrors.email_link_error) &&
        toast.error(te("email_link_error"));
      error?.message.includes(AuthValidationErrors.token_error) &&
        toast.error(te("token_error"));

      if (!error && !data.user?.identities?.length) {
        toast.error(te("user_exists"));
        return;
      }

      //on success
      !error && data.user && setCheckMail(data.user.email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.map((error) => {
          error.message === AuthValidationErrors.wrong_email &&
            toast.error(te("wrong_email"));
          error.message === AuthValidationErrors.wrong_password &&
            toast.error(te("wrong_password"), {
              duration: 7000,
            });
        });
      } else {
        toast.error(te("something_went_wrong"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return checkMail ? (
    <h1 className="flex flex-col gap-1 text-center text-xl">
      <span className="text-3xl">✉️</span>
      {t("check your email to continue login", { email: checkMail })}
    </h1>
  ) : (
    <>
      <h1 className="mb-[32px] text-3xl font-semibold">{t(view)}</h1>
      {!loginByEmail ? (
        <div className="flex flex-col items-center gap-1">
          {Providers.map((provider) => (
            <ButtonWhite
              key={provider}
              onClick={() => handleProviderLogin(provider)}
              className="w-[220px]"
            >
              {t("with")}{" "}
              <span className="first-letter:uppercase">{provider}</span>
            </ButtonWhite>
          ))}
          <button
            className="mt-5 font-semibold underline"
            onClick={() => setLoginByEmail(true)}
          >
            {t("logIn/signUp with email and password", { view: t(view) })}
          </button>
        </div>
      ) : (
        <>
          <form
            className="flex max-w-sm flex-1 flex-col items-center justify-center justify-center gap-1"
            onSubmit={view === "logIn" ? handleLogIn : handleSignUp}
          >
            <Input
              label={t("email:")}
              id="email-input"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="✉️"
              required
            />
            <Input
              label={t("password:")}
              id="password-input"
              type="password"
              name="password"
              placeholder="🔐"
              required
            />
            {view === "signUp" && (
              <Input
                label={t("repeat password:")}
                id="password-repeat-input"
                type="password"
                name="password-repeat"
                placeholder="🔒"
                required
              />
            )}
            <Link className="underline" href={"/"}>
              {t("forgot your password?")}
            </Link>
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
            {t("logIn/signUp with provider", { view: t(view) })}
          </button>
        </>
      )}
      <div className="my-10">
        {view === "logIn" && (
          <p>
            {t.rich("no account yet? sign up", {
              Link: (chunks) => (
                <Link href="/signup" className="font-medium underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        )}
        {view === "signUp" && (
          <p>
            {t.rich("already have an account? log in", {
              Link: (chunks) => (
                <Link href="/login" className="font-medium underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        )}
      </div>
    </>
  );
};
