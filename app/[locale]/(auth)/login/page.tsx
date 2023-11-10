import { type Metadata } from "next";

import { AuthPage } from "~/components/Auth/AuthPage";

export function generateMetadata(): Metadata {
  return {
    title: "Log In",
  };
}

export default function LoginPage() {
  return <AuthPage view="logIn" />;
}
