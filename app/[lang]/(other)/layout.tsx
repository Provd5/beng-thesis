import { Settings } from "~/components/Settings";
import { type Locale } from "~/dictionaries";

export default function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  // const t = await getTranslator(params.lang);

  return (
    <main className="nav-padding relative flex h-full flex-col text-xl text-white-light">
      {children}
      <Settings params={params} />
    </main>
  );
}
