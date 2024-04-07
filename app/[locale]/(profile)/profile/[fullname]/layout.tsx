import { Suspense } from "react";
import { unstable_setRequestLocale } from "next-intl/server";

import { Profile } from "~/components/Profile/Profile";
import { ProfileLoader } from "~/components/ui/Loaders/Skeletons/ProfileLoader";
import { type localeTypes } from "~/i18n";

export function generateMetadata({ params }: { params: { fullname: string } }) {
  return {
    title: {
      default: `@${decodeURIComponent(params.fullname)}`,
      template: `@${decodeURIComponent(params.fullname)}/%s | Booksphere`,
    },
  };
}

export default function ProfileFullnameLayout({
  children,
  params: { fullname, locale },
}: {
  children: React.ReactNode;
  params: { fullname: string; locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  return (
    <Suspense key={`profile-${fullname}`} fallback={<ProfileLoader />}>
      <Profile profileName={fullname}>{children}</Profile>
    </Suspense>
  );
}
