import { type Metadata } from "next";
import { Quicksand } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { getMessages } from "next-intl/server";

import { Navbar } from "~/components/Links/Navbar/Navbar";
import { DarkModeInitializer } from "~/components/ui/DarkModeInitializer";
import { ToasterComponent } from "~/components/ui/ToasterComponent";
import { type localeTypes, routing } from "~/i18n/routing";
import { cn } from "~/utils/cn";

import "~/styles/globals.css";

const quicksandFont = Quicksand({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

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
      images: ["og-main.jpg"],
    },
    twitter: {
      title: "Booksphere",
      description: t("page description"),
      card: "summary_large_image",
      images: ["twitter-large.jpg"],
    },
  };
}

export default async function RootLayout({
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

  const messages = await getMessages();

  return (
    <html lang={validLocale} className={cn(quicksandFont.className, "dark")}>
      <body className="bg-gradient relative flex h-full flex-col-reverse bg-fixed text-base font-medium text-colors-text antialiased selection:bg-colors-accent selection:text-white md:flex-col">
        <DarkModeInitializer />

        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          {children}
          <ToasterComponent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
