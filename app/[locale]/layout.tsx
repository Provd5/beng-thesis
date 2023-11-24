import { Quicksand } from "next/font/google";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";

import { Navbar } from "~/components/Navbar/Navbar";
import { DarkModeInitializer } from "~/components/ui/DarkModeInitializer";
import { SvgPainter } from "~/components/ui/SvgIcons/SvgPainter";
import { ToasterComponent } from "~/components/ui/ToasterComponent";
import { type localeTypes } from "~/i18n";

import "~/styles/globals.css";

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
    "Booksphere is a dynamic application designed for book enthusiasts. Users have the ability to share reviews, ratings, and inspirations related to their favorite reads. Within this platform, readers can create virtual shelves where they can gather both read and planned books, making it easier to track their literary conquests. Booksphere not only facilitates the management of a book collection but also integrates a community of literature lovers, creating a shared space for reading enthusiasts.",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: localeTypes };
}) {
  const messages = await getMessages(locale);
  const preferTheme = headers().get("sec-ch-prefers-color-scheme");

  return (
    <html lang={locale} className={quicksandFont.className}>
      <body className="bodyGradient relative flex h-full flex-col bg-fixed text-base font-medium text-black antialiased dark:text-white">
        <DarkModeInitializer preferTheme={preferTheme} />
        <SvgPainter />

        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          {children}
          <ToasterComponent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
