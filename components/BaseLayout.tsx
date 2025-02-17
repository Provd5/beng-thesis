import { type ReactNode } from "react";
import { Quicksand } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { cn } from "~/utils/cn";

import { Navbar } from "./Links/Navbar/Navbar";
import { DarkModeInitializer } from "./ui/DarkModeInitializer";
import { ToasterComponent } from "./ui/ToasterComponent";

const quicksandFont = Quicksand({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export default async function BaseLayout({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} className={cn(quicksandFont.className, "dark")}>
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
