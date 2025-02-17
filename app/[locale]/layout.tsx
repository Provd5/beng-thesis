import { type Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import BaseLayout from "~/components/BaseLayout";
import { type localeTypes, routing } from "~/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: localeTypes }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "Nav.CategoryTitles",
  });

  return {
    title: {
      default: "Booksphere",
      template: "%s | Booksphere",
    },
    description: t("page description"),

    alternates: {
      canonical: "/",
      languages: {
        en: "/en",
        pl: "/pl",
      },
    },
    openGraph: {
      title: "Booksphere",
      description: t("page description"),
      images: ["/og-main.jpg"],
    },
    twitter: {
      title: "Booksphere",
      description: t("page description"),
      card: "summary_large_image",
      images: ["/twitter-large.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: localeTypes }>;
}) {
  const { locale } = await params;
  const validLocale = routing.locales.includes(locale)
    ? locale
    : routing.defaultLocale;

  setRequestLocale(locale);

  return <BaseLayout locale={validLocale}>{children}</BaseLayout>;
}
