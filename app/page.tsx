import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import LogoutButton from "./components/LogoutButton";
import { Button } from "./components/ui/Button";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-3">
      {user && (
        <span className="flex gap-4">
          Hey, {user.email}! <span className="border-r"></span> <LogoutButton />
        </span>
      )}
      <Button square size="sm" loading>
        testbutton
      </Button>
    </div>
  );
}
