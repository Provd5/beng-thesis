import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { BackCategoryLink } from "~/components/ui/BackCategoryLink";

export default async function StatisticsPage({
  params: { fullname },
}: {
  params: { fullname: string };
}) {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // const [publicUserData, myFullname] = await Promise.all([
  //   db.profile.findUnique({
  //     where: { full_name: fullname },
  //     select: {
  //       id: true,
  //       avatar_url: true,
  //       private: true,
  //       full_name: true,
  //       description: true,
  //     },
  //   }),
  //   session?.user &&
  //     db.profile.findUnique({
  //       where: { id: session.user.id },
  //       select: { id: true, full_name: true },
  //     }),
  // ]);

  return (
    <>
      <div className="flex flex-col gap-3 pt-6">
        <BackCategoryLink variant="STATISTICS" href={`/profile/${fullname}`} />
        <div>
          <h1>Finished books:</h1>
          <p></p>
        </div>
        <div>
          <h1>Owned books:</h1>
          <p></p>
        </div>
        <div>
          <h1>Liked books:</h1>
          <p></p>
        </div>
        <div>
          <h1>Reviews written:</h1>
          <p></p>
        </div>
        <div>
          <h1>Latest read book:</h1>
          <p></p>
        </div>
        <div>
          <h1>Pages read:</h1>
          <p></p>
        </div>
        <div>
          <h1>Most pages:</h1>
          <p></p>
        </div>
        <div>
          <h1>Most-read author:</h1>
          <p></p>
          <h1>Read books from this author:</h1>
          <p></p>
        </div>
        <div>
          <h1>Most read genre:</h1>
          <p></p>
        </div>
      </div>
    </>
  );
}
