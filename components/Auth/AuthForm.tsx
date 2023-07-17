"use client";

import { type FC, type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { type Provider } from "@supabase/supabase-js";

import { BiSolidErrorCircle } from "react-icons/bi";

import { PasswordValidator } from "~/utils/validations/password";

import { ButtonWhite } from "../ui/Buttons";

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

  const [checkMail, setCheckMail] = useState(false);
  const [mail, setMail] = useState("");
  const [loginByEmail, setLoginByEmail] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const Providers: Provider[] = ["discord", "google", "github"];

  const handleProviderLogin = async (providerType: Provider) => {
    setIsLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: providerType,
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
      },
    });

    error && setErrorMsg(error.message);
    setIsLoading(false);
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

    data.user && router.refresh();
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
    const passwordRepeat = form.elements.namedItem(
      "password-repeat"
    ) as HTMLInputElement;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?])[A-Za-z\d!@#$%^&*()_\-+=<>?]{10,}$/;

    console.log(PasswordValidator.parse(password.value));

    if (!passwordRegex.test(password.value)) {
      setErrorMsg(
        "Password must contain at least 10 characters, number, special character, both lower and uppercase letters"
      );
    } else if (password.value !== passwordRepeat.value) {
      setErrorMsg("Given passwords do not match");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
          emailRedirectTo: `${location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (!data.user?.identities?.length) {
        setErrorMsg("Email already exists");
      } else {
        setMail(email.value);
        data.user && setCheckMail(true);
      }
    }

    setIsLoading(false);
  };

  return !errorMsg && checkMail ? (
    <h1 className="flex flex-col gap-1 text-center text-xl">
      <span className="text-3xl">✉️ {mail}</span>
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
            {view === "signUp" && (
              <div className="flex flex-col">
                <label className="ml-3" htmlFor="password-repeat-input">
                  {Auth.repeatPassword}:
                </label>
                <input
                  className="w-64 rounded-lg bg-white px-3 py-2 text-md text-black dark:bg-black dark:text-white"
                  id="password-repeat-input"
                  type="password"
                  name="password-repeat"
                  placeholder="🔒"
                  required
                />
              </div>
            )}
            <Link className="underline" href={"/"}>
              {Auth.ForgotPassword}?
            </Link>
            <div className="min-h-[64px]">
              {errorMsg && (
                <div className="flex items-center gap-1 rounded-md bg-red p-2 font-semibold text-white">
                  <BiSolidErrorCircle className="shrink-0" />
                  {errorMsg}
                </div>
              )}
            </div>
            <ButtonWhite
              loading={isLoading}
              type="submit"
              className="uppercase"
            >
              {view === "logIn" ? Auth.LogInToAccount : Auth.CreateAccount}
            </ButtonWhite>
          </form>
          <button
            className="mt-5 font-semibold underline"
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
