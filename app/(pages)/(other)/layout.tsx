export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="nav-padding flex h-full flex-col">{children}</main>;
}
