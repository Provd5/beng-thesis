import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { SearchComponent } from "~/components/Search/SearchComponent";

export default async function SearchPage() {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return <SearchComponent sessionId={session?.user.id} />;
}
