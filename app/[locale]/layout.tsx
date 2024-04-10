import { type Metadata } from "next";
import { Quicksand } from "next/font/google";
import { notFound } from "next/navigation";
import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { Navbar } from "~/components/Links/Navbar/Navbar";
import { DarkModeInitializer } from "~/components/ui/DarkModeInitializer";
import { ToasterComponent } from "~/components/ui/ToasterComponent";
import { type localeTypes } from "~/i18n";

import "~/styles/globals.css";

const quicksandFont = Quicksand({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export function generateStaticParams() {
  return [{ locale: "pl" }, { locale: "en" }];
}

export async function getMessages(locale: localeTypes) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return (await import(`../../lang/${locale}.json`))
      .default as AbstractIntlMessages;
  } catch (error) {
    notFound();
  }
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: localeTypes };
}): Promise<Metadata> {
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
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages(locale);

  return (
    <html lang={locale} className={quicksandFont.className}>
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
