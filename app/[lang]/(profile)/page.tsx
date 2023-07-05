import { LogoutButton } from "~/components/LogoutButton";
import { getTranslator, type Locale } from "~/dictionaries";

export default async function ProfilePage({
  params,
}: {
  params: { lang: Locale };
}) {
  const t = await getTranslator(params.lang);

  return (
    <>
      <div>ProfilePage</div>
      <LogoutButton text={t.Explore.categoryTitle} />
    </>
  );
}
