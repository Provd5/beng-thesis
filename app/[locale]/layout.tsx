import { Suspense } from "react";
import { Quicksand } from "next/font/google";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";

import { Navbar } from "~/components/Navbar/Navbar";
import { ToasterComponent } from "~/components/ui/ToasterComponent";
import { type localeTypes } from "~/i18n";

import "~/styles/globals.css";
import Loading from "./loading";

const quicksandFont = Quicksand({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// eslint-disable-next-line @typescript-eslint/require-await
// export async function generateStaticParams() {
//   return locales.map((locale) => getLocaleFrom({ locale }));
// }

export async function getMessages(locale: localeTypes) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return (await import(`../../lang/${locale}.json`))
      .default as AbstractIntlMessages;
  } catch (error) {
    notFound();
  }
}

export type PageProps = {
  params: { locale: localeTypes };
};

export const metadata = {
  title: {
    default: "Being Thesis",
    template: "%s | Being Thesis",
    absolute: "Welcome to Being Thesis!",
  },
  description: "This is main description",
};

export default async function RootLayout({
  children,
  params: { locale },
}: PageProps & {
  children: React.ReactNode;
}) {
  const messages = await getMessages(locale);
  const preferTheme = headers().get("sec-ch-prefers-color-scheme");

  const themeInitializerScript = `function initializeDarkMode() { localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark");} initializeDarkMode();`;

  return (
    <html
      lang={locale}
      className={
        quicksandFont.className + (preferTheme === "dark" ? " dark" : "")
      }
    >
      <body className="relative flex h-full shrink-0 grow flex-col bg-gradient-light bg-fixed font-medium text-black dark:bg-gradient-dark dark:text-white">
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />

        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar locale={locale} />
          <Suspense fallback={<Loading />}>
            {children}
            <ToasterComponent />
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
