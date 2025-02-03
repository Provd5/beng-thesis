import { Logo } from "~/components/Logo";
import { Settings } from "~/components/Modals/Settings";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="nav-padding relative flex h-full grow-1 flex-col overflow-x-hidden overflow-y-hidden text-xl text-white">
      {children}
      <div className="absolute top-3 right-4 md:top-5 md:right-6">
        <Settings />
      </div>
      <Logo />
    </main>
  );
}
