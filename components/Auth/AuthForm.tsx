"use client";

import { type FC, type FormEvent, useState } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { type Provider } from "@supabase/supabase-js";

import { BiSolidErrorCircle } from "react-icons/bi";

import { ButtonWhite } from "../ui/Buttons";

interface AuthFormProps {
  view: "logIn" | "signUp";
  Auth: {
    email: string;
    and: string;
    password: string;
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

  const [checkMail, setCheckMail] = useState(false);
  const [loginByEmail, setLoginByEmail] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const Providers: Provider[] = ["discord", "google", "github"];

  const handleSocialLogin = async (providerType: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: providerType,
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
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

    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    error && setErrorMsg(error.message);
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
        emailRedirectTo: `${location.origin}/api/auth/callback`,
      },
    });

    error && setErrorMsg(error.message);
    data.user && setCheckMail(true);

    setIsLoading(false);
  };

  return checkMail ? (
    <h1 className="flex flex-col gap-1 text-center text-xl">
      <span className="text-3xl">✉️</span>
      {Auth.CheckYourEmail}.
    </h1>
  ) : (
    <>
      <h1 className="mb-10 text-3xl font-semibold">
        {view === "logIn" ? Auth.logIn : Auth.signUp}
      </h1>
      {!loginByEmail ? (
        <div className="flex flex-col items-center gap-1">
          {Providers.map((provider) => (
            <ButtonWhite
              key={provider}
              onClick={() => handleSocialLogin(provider)}
              className="w-[220px]"
            >
              {Auth.with}{" "}
              <span className="first-letter:uppercase">{provider}</span>
            </ButtonWhite>
          ))}
          <button
            className="mt-6 font-semibold underline"
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
            <div className="flex flex-col">
              <label className="ml-3" htmlFor="email-input">
                {Auth.email}:
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
                {Auth.password}:
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
              {Auth.ForgotPassword}?
            </Link>
            <ButtonWhite
              loading={isLoading}
              type="submit"
              className="mt-3 uppercase"
            >
              {view === "logIn" ? Auth.LogInToAccount : Auth.CreateAccount}
            </ButtonWhite>
          </form>
          <button
            className="mt-6 font-semibold underline"
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
