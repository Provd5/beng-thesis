"use client";

import { type FC, type FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { type Provider } from "@supabase/supabase-js";
import { z } from "zod";

import {
  AuthValidationErrors,
  LoginValidator,
  SignupValidator,
} from "~/utils/validations/auth";
import { supabaseAuthValidatorErrors } from "~/utils/validations/supabaseAuth";

import { ButtonWhite } from "../ui/Buttons";
import { Input } from "../ui/Input";

interface AuthFormProps {
  view: "logIn" | "signUp";
  Auth: {
    email: string;
    and: string;
    password: string;
    repeatPassword: string;
    logIn: string;
    signUp: string;
    with: string;
    provider: string;
    ForgotPassword: string;
    NoAccountYet: string;
    CreateAccount: string;
    AlreadyHaveAccount: string;
    LogInToAccount: string;
    CheckYourEmail: string;
  };
}

export const AuthForm: FC<AuthFormProps> = ({ view, Auth }) => {
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
      toast.error("Something went wrong. Please try again.");
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

      error?.message.includes(supabaseAuthValidatorErrors.login_error) &&
        toast.error("zle dane");
      error?.message.includes(
        supabaseAuthValidatorErrors.email_not_confirmed
      ) && toast.error("nie potwierdzono");

      //on success
      data.user && router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.map((error) => {
          error.message === AuthValidationErrors.wrong_email &&
            toast.error("wrong_email");
          error.message === AuthValidationErrors.password_required_error &&
            toast.error("password_required_error");
        });
      } else {
        toast.error("Something went wrong. Please try again.");
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
        toast.error("nie takie same");
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

      error?.message.includes(
        supabaseAuthValidatorErrors.disabled_signups_error
      ) && toast.error("DISABLED_SIGNUPS_ERROR");
      error?.message.includes(supabaseAuthValidatorErrors.email_link_error) &&
        toast.error("EMAIL_LINK_ERROR");
      error?.message.includes(supabaseAuthValidatorErrors.token_error) &&
        toast.error("TOKEN_ERROR");

      if (!error && !data.user?.identities?.length) {
        toast.error("USER_EXIST");
        return;
      }

      //on success
      !error && data.user && setCheckMail(data.user.email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.map((error) => {
          error.message === AuthValidationErrors.wrong_email &&
            toast.error("wrong_email");
          error.message === AuthValidationErrors.wrong_password &&
            toast.error("wrong_password");
          error.message === AuthValidationErrors.password_too_short &&
            toast.error("password_too_short");
        });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return checkMail ? (
    <h1 className="flex flex-col gap-1 text-center text-xl">
      <span className="text-3xl">✉️ {checkMail}</span>
      {Auth.CheckYourEmail}.
    </h1>
  ) : (
    <>
      <h1 className="mb-[32px] text-3xl font-semibold">
        {view === "logIn" ? Auth.logIn : Auth.signUp}
      </h1>
      {!loginByEmail ? (
        <div className="flex flex-col items-center gap-1">
          {Providers.map((provider) => (
            <ButtonWhite
              key={provider}
              onClick={() => handleProviderLogin(provider)}
              className="w-[220px]"
            >
              {Auth.with}{" "}
              <span className="first-letter:uppercase">{provider}</span>
            </ButtonWhite>
          ))}
          <button
            className="mt-5 font-semibold underline"
            onClick={() => setLoginByEmail(true)}
          >
            {view === "logIn" ? Auth.logIn : Auth.signUp} {Auth.with}{" "}
            {Auth.email} {Auth.and} {Auth.password}
          </button>
        </div>
      ) : (
        <>
          <form
            className="flex max-w-sm flex-1 flex-col items-center justify-center justify-center gap-1"
            onSubmit={view === "logIn" ? handleLogIn : handleSignUp}
          >
            <Input
              label={`${Auth.email}:`}
              id="email-input"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="✉️"
              required
            />
            <Input
              label={`${Auth.password}:`}
              id="password-input"
              type="password"
              name="password"
              placeholder="🔐"
              required
            />
            {view === "signUp" && (
              <Input
                label={`${Auth.repeatPassword}:`}
                id="password-repeat-input"
                type="password"
                name="password-repeat"
                placeholder="🔒"
                required
              />
            )}
            <Link className="underline" href={"/"}>
              {Auth.ForgotPassword}?
            </Link>
            <ButtonWhite
              loading={isLoading}
              type="submit"
              className="my-5 uppercase"
            >
              {view === "logIn" ? Auth.LogInToAccount : Auth.CreateAccount}
            </ButtonWhite>
          </form>
          <button
            className="font-semibold underline"
            onClick={() => setLoginByEmail(false)}
          >
            {view === "logIn" ? Auth.logIn : Auth.signUp} {Auth.with}{" "}
            {Auth.provider}
          </button>
        </>
      )}
      <div className="my-10">
        {view === "logIn" && (
          <p>
            {Auth.NoAccountYet}?{" "}
            <Link className="font-medium underline" href="/signup">
              {Auth.CreateAccount}
            </Link>
          </p>
        )}
        {view === "signUp" && (
          <p>
            {Auth.AlreadyHaveAccount}?{" "}
            <Link className="font-medium underline" href="/login">
              {Auth.LogInToAccount}
            </Link>
          </p>
        )}
      </div>
    </>
  );
};
