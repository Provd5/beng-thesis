import "./styles/globals.css";
import { Navbar } from "./components/Navbar";

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
    <html lang="en">
      <body>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center bg-neutral-900">
          {children}
        </main>
      </body>
    </html>
  );
}
