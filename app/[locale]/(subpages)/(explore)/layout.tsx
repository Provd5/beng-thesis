import { SubpageNavbar } from "~/components/Explore/SubpageNavbar";

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
