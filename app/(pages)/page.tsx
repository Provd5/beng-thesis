import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/profile");

  return (
    <>
      <div>{"Coś tu będzie (aktualności czy coś)"}</div>
    </>
  );
}
