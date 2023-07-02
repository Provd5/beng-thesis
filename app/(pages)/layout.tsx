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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={quicksandFont.className}>
      <body className="relative flex h-full shrink-0 grow flex-col bg-gradient-light bg-fixed text-black dark:bg-gradient-dark dark:text-white">
        <Navbar />
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </body>
    </html>
  );
}
