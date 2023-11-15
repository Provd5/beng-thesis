import { Suspense } from "react";
import { Quicksand } from "next/font/google";
import { notFound } from "next/navigation";
import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";

import { Navbar } from "~/components/Navbar/Navbar";
import { SvgPainter } from "~/components/ui/SvgIcons/SvgPainter";
import { ToasterComponent } from "~/components/ui/ToasterComponent";
import { type localeTypes } from "~/i18n";

import "~/styles/globals.css";
import Loading from "./loading";

const quicksandFont = Quicksand({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export async function getMessages(locale: localeTypes) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return (await import(`../../lang/${locale}.json`))
      .default as AbstractIntlMessages;
  } catch (error) {
    notFound();
  }
}

export const metadata = {
  title: {
    default: "Booksphere",
    template: "%s | Booksphere",
  },
  description:
    "Booksphere to dynamiczna aplikacja, stworzona z myślą o miłośnikach książek. Użytkownicy mają możliwość dzielenia się recenzjami, ocenami i inspiracjami związanymi z ich ulubionymi lekturami. W ramach tej platformy, czytelnicy mogą tworzyć wirtualne półki, na których gromadzą zarówno przeczytane, jak i planowane książki, co ułatwia śledzenie ich literackich podbojów. Booksphere nie tylko ułatwia zarządzanie książkową kolekcją, ale także integruje społeczność miłośników literatury, tworząc wspólne miejsce dla pasjonatów czytania.",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: localeTypes };
}) {
  const messages = await getMessages(locale);

  const themeInitializerScript = `function initializeDarkMode() { localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark");} initializeDarkMode();`;

  return (
    <html lang={locale} className={quicksandFont.className}>
      <body className="bodyGradient relative flex h-screen flex-col bg-fixed text-base font-medium text-black antialiased dark:text-white">
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
        <SvgPainter />

        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <Suspense fallback={<Loading />}>
            {children}
            <ToasterComponent />
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
