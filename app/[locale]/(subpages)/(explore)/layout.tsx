import { SubpageNavbar } from "~/components/Links/SubpageNavbar";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SubpageNavbar />
      {children}
    </>
  );
}
