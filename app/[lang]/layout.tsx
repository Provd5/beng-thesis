import { Suspense } from "react";
import { Quicksand } from "next/font/google";
import { headers } from "next/headers";

import { Navbar } from "~/components/Navbar/Navbar";
import { ToasterComponent } from "~/components/ui/ToasterComponent";
import { type Locale } from "~/dictionaries";

import "~/styles/globals.css";
import Loading from "./loading";

const quicksandFont = Quicksand({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Being Thesis",
    template: "%s | Being Thesis",
    absolute: "Welcome to Being Thesis!",
  },
  description: "This is main description",
};

// eslint-disable-next-line @typescript-eslint/require-await
// export async function generateStaticParams() {
//   return locales.map((locale) => getLocaleFrom({ locale }));
// }

export type PageProps = {
  params: { lang: Locale };
};

export default function RootLayout({
  children,
  params,
}: PageProps & {
  children: React.ReactNode;
}) {
  const preferTheme = headers().get("sec-ch-prefers-color-scheme");

  const themeInitializerScript = `function initializeDarkMode() { localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark");} initializeDarkMode();`;

  return (
    <html
      lang={params.lang}
      className={
        quicksandFont.className + (preferTheme === "dark" ? " dark" : "")
      }
    >
      <body className="relative flex h-full shrink-0 grow flex-col bg-gradient-light bg-fixed font-medium text-black dark:bg-gradient-dark dark:text-white">
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
        <Navbar params={params} />
        <Suspense fallback={<Loading />}>
          {children}
          <ToasterComponent />
        </Suspense>
      </body>
    </html>
  );
}
