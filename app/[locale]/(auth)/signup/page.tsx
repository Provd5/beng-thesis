import { type Metadata } from "next";

import { AuthPage } from "~/components/Auth/AuthPage";

export function generateMetadata(): Metadata {
  return {
    title: "Sign Up",
  };
}

export default function SignUpPage() {
  return <AuthPage view="signUp" />;
}
