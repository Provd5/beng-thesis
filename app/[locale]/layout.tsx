import { type Metadata } from "next";
import { Quicksand } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getMessages } from "next-intl/server";

import { Navbar } from "~/components/Links/Navbar/Navbar";
import { ToasterComponent } from "~/components/ui/ToasterComponent";
import { type localeTypes, routing } from "~/i18n/routing";

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
  params: { locale: localeTypes };
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

    twitter: {
      card: "summary_large_image",
    },
    alternates: {
      canonical: "/",
      languages: {
        en: "/en",
        pl: "/pl",
      },
    },
    openGraph: {
      title: {
        default: "Booksphere",
        template: "%s | Booksphere",
      },
      description: t("page description"),
      siteName: "Booksphere",
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: localeTypes };
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={quicksandFont.className}>
      <body className="bg-gradient relative flex h-full flex-col-reverse bg-fixed text-base font-medium text-colors-text antialiased selection:bg-colors-accent selection:text-white md:flex-col">
        {/* <DarkModeInitializer /> */}

        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          {children}
          <ToasterComponent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
