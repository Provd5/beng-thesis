import { cookies } from "next/headers";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { createServerClient } from "@supabase/ssr";

import { booksOrderByArray } from "~/types/feed/OrderVariants";

import { FeedWithSorting } from "~/components/Feed/FeedWithSorting";
import { type localeTypes } from "~/i18n";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t("explore"),
  };
}

export default async function ExplorePage({
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
        feedVariant="books"
        orderArray={booksOrderByArray}
        takeLimit={20}
        sessionId={session?.user.id}
        profileName={undefined}
        variant={undefined}
      />
    </div>
  );
}
