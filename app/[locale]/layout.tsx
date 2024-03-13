import { Quicksand } from "next/font/google";
import { notFound } from "next/navigation";
import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { Navbar } from "~/components/Navbar/Navbar";
import { DarkModeInitializer } from "~/components/ui/DarkModeInitializer";
import { SvgPainter } from "~/components/ui/SvgIcons/SvgPainter";
import { ToasterComponent } from "~/components/ui/ToasterComponent";
import { defaultLocale, locales, type localeTypes } from "~/i18n";

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
}) {
  const validLocale = locales.includes(locale) ? locale : defaultLocale;
  const t = await getTranslations({
    validLocale,
    namespace: "Nav.CategoryTitles",
  });

  return {
    title: {
      default: "Booksphere",
      template: "%s | Booksphere",
    },
    description: t("page description"),
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: localeTypes };
}) {
  const validLocale = locales.includes(locale) ? locale : defaultLocale;
  unstable_setRequestLocale(validLocale);
  const messages = await getMessages(validLocale);

  const themeInitializerScript = `function initializeDarkMode() { localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark");} initializeDarkMode();`;

  return (
    <html lang={validLocale} className={quicksandFont.className}>
      <body className="bodyGradient relative flex h-full flex-col-reverse bg-fixed text-base font-medium text-black antialiased selection:bg-secondary selection:text-white dark:text-white md:flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
        <DarkModeInitializer />
        <SvgPainter />

        <NextIntlClientProvider locale={validLocale} messages={messages}>
          <Navbar />
          {children}
          <ToasterComponent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
