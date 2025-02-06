import { Suspense } from "react";
import { type Metadata } from "next";

import { Profile } from "~/components/Profile/Profile";
import { LoadingPage } from "~/components/ui/Loaders/LoadingPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ fullname: string }>;
}): Promise<Metadata> {
  const { fullname } = await params;
  return {
    title: {
      default: `@${decodeURIComponent(fullname)}`,
      template: `@${decodeURIComponent(fullname)}/%s | Booksphere`,
    },
  };
}

export default async function ProfileFullnameLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ fullname: string }>;
}) {
  const { fullname } = await params;
  return (
    <Suspense key={`profile-${fullname}`} fallback={<LoadingPage />}>
      <Profile profileName={fullname}>{children}</Profile>
    </Suspense>
  );
}
