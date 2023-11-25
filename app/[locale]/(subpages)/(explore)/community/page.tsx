import { cookies } from "next/headers";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { createServerClient } from "@supabase/ssr";

import { profilesOrderByArray } from "~/types/feed/OrderVariants";

import { FeedWithSorting } from "~/components/Feed/FeedWithSorting";
import { type localeTypes } from "~/i18n";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t("community"),
  };
}

export default async function CommunityPage({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="container pb-12">
      <FeedWithSorting
        feedVariant="profiles"
        orderArray={profilesOrderByArray}
        takeLimit={30}
        sessionId={session?.user.id}
        userId={undefined}
        variant={undefined}
      />
    </div>
  );
}
