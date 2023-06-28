"use client";

import { type FC, type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { type Provider } from "@supabase/supabase-js";

import { Button } from "./ui/Button";

interface AuthFormProps {
  view: "logIn" | "signUp";
}

export const AuthForm: FC<AuthFormProps> = ({ view }) => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [checkMail, setCheckMail] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const Providers: Provider[] = ["discord", "google", "github"];

  const handleSocialLogin = async (providerType: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: providerType,
      options: {
        redirectTo: location.origin,
      },
    });

    error ? setErrorMsg(error.message) : setErrorMsg("");
  };

  const handleLogIn = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    error ? setErrorMsg(error.message) : setErrorMsg("");
    data.user && router.refresh();
    setIsLoading(false);
  };

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
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

    error ? setErrorMsg(error.message) : setErrorMsg("");
    data.user && setCheckMail(true);
    setIsLoading(false);
  };

  return checkMail ? (
    <div>check your mail to login</div>
  ) : (
    <div>
      {Providers.map((provider) => (
        <Button
          key={provider}
          variant="outline"
          size="lg"
          uppercase={false}
          onClick={() => handleSocialLogin(provider)}
        >
          {view === "logIn" ? "Log in with" : "Sign up with"}{" "}
          {provider.toUpperCase()}
        </Button>
      ))}
      <form
        className="flex w-full max-w-sm flex-1 flex-col justify-center gap-2"
        onSubmit={view === "logIn" ? handleLogIn : handleSignUp}
      >
        {errorMsg && <div>{errorMsg}</div>}
        <div className="flex gap-1">
          <label className="bg-red-100" htmlFor="email-input">
            Email
          </label>
          <input
            className="mb-6 rounded-md border bg-inherit px-4 py-2 text-neutral-100"
            id="email-input"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="email"
          />
        </div>
        <div>
          <label className="text-md text-neutral-400" htmlFor="password-input">
            Password
          </label>
          <input
            className="mb-6 rounded-md border bg-inherit px-4 py-2 text-neutral-100"
            id="password-input"
            type="password"
            name="password"
            placeholder="••••••••"
          />
        </div>
        <Button loading={isLoading} type="submit">
          {view === "logIn" ? "login" : "sign up"}
        </Button>
      </form>
      {view === "logIn" && (
        <div>
          No account yet?{" "}
          <Button variant="link" size="sm">
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      )}
      {view === "signUp" && (
        <div>
          Already have an account?{" "}
          <Button variant="link" size="sm">
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
