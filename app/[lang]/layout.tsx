import { Suspense } from "react";
import { Quicksand } from "next/font/google";

import { Navbar } from "~/components/Navbar/Navbar";

import "~/styles/globals.css";
import Loading from "./loading";

const quicksandFont = Quicksand({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata = {
  title: "Welcome to Being Thesis!",
  description: "This is main description",
};

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "pl" }];
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const themeInitializerScript = `function initializeDarkMode() { localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark");} initializeDarkMode();`;

  return (
    <html lang={params.lang} className={quicksandFont.className}>
      <body className="relative flex h-full shrink-0 grow flex-col bg-gradient-light bg-fixed font-medium text-black dark:bg-gradient-dark dark:text-white">
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
        <Navbar />
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </body>
    </html>
  );
}
