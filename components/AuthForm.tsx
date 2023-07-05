"use client";

import { type FC, type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { type Provider } from "@supabase/supabase-js";

import { BiSolidErrorCircle } from "react-icons/bi";

import { Button, ButtonWhite } from "./ui/Buttons";

interface AuthFormProps {
  view: "logIn" | "signUp";
}

export const AuthForm: FC<AuthFormProps> = ({ view }) => {
  const supabase = createClientComponentClient();

  const router = useRouter();
  const [checkMail, setCheckMail] = useState(false);
  const [loginByEmail, setLoginByEmail] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const Providers: Provider[] = ["discord", "google", "github"];

  const handleSocialLogin = async (providerType: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: providerType,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    error ? setErrorMsg(error.message) : setErrorMsg("");
  };

  const handleLogIn = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    setErrorMsg("");
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    error && setErrorMsg(error.message);
    data.user && router.refresh();
    setIsLoading(false);
  };

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    setErrorMsg("");
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;

    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    error && setErrorMsg(error.message);
    data.user && setCheckMail(true);
    setIsLoading(false);
  };

  return (
    <div className="relative flex h-full flex-col items-center justify-between px-3 py-8 text-sm text-white-light">
      <div />
      <div className="flex flex-col items-center">
        {checkMail ? (
          <h1 className="text-center text-xl">
            Check your <span className="font-bold">✉️email</span> to continue
            login.
          </h1>
        ) : (
          <>
            <h1 className="mb-10 text-3xl font-semibold">
              {view === "logIn" ? "Log in" : "Sign up"}
            </h1>
            {!loginByEmail ? (
              <div className="flex flex-col gap-1">
                {Providers.map((provider) => (
                  <Button
                    key={provider}
                    onClick={() => handleSocialLogin(provider)}
                  >
                    {view === "logIn" ? "Log in with" : "Sign up with"}{" "}
                    <span className="first-letter:uppercase">{provider}</span>
                  </Button>
                ))}
                <button
                  className="mt-6 font-semibold underline"
                  onClick={() => setLoginByEmail(true)}
                >
                  {view === "logIn" ? "Log in" : "Sign up"} with email and
                  password
                </button>
              </div>
            ) : (
              <>
                <form
                  className="flex max-w-sm flex-1 flex-col items-center justify-center justify-center gap-1"
                  onSubmit={view === "logIn" ? handleLogIn : handleSignUp}
                >
                  <div className="flex flex-col">
                    <label className="ml-3" htmlFor="email-input">
                      Email:
                    </label>
                    <input
                      className="w-64 rounded-lg bg-white px-3 py-2 text-md text-black dark:bg-black dark:text-white"
                      id="email-input"
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="✉️"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="ml-3" htmlFor="password-input">
                      Password:
                    </label>
                    <input
                      className="w-64 rounded-lg bg-white px-3 py-2 text-md text-black dark:bg-black dark:text-white"
                      id="password-input"
                      type="password"
                      name="password"
                      placeholder="🔐"
                      required
                    />
                  </div>
                  {errorMsg && (
                    <div className="flex items-center gap-1 font-semibold text-red">
                      <BiSolidErrorCircle />
                      {errorMsg}
                    </div>
                  )}
                  <Link className="underline" href={"/"}>
                    Forgot your password?
                  </Link>
                  <ButtonWhite
                    loading={isLoading}
                    type="submit"
                    className="mt-3 uppercase"
                  >
                    {view === "logIn" ? "login" : "sign up"}
                  </ButtonWhite>
                </form>
                <button
                  className="mt-6 font-semibold underline"
                  onClick={() => setLoginByEmail(false)}
                >
                  {view === "logIn" ? "Log in" : "Sign up"} with provider
                </button>
              </>
            )}

            <div className="my-10">
              {view === "logIn" && (
                <p>
                  No account yet?{" "}
                  <Link className="font-medium underline" href="/signup">
                    Sign up
                  </Link>
                </p>
              )}
              {view === "signUp" && (
                <p>
                  Already have an account?{" "}
                  <Link className="font-medium underline" href="/login">
                    Log in
                  </Link>
                </p>
              )}
            </div>
          </>
        )}
      </div>
      <p className="text-xs">
        By logging in, you agree to{" "}
        <Link href={"/"} className="underline">
          our terms of service
        </Link>
        .
      </p>
    </div>
  );
};
