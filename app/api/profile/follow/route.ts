import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { db } from "~/lib/db";
import { GlobalErrors } from "~/lib/validations/errorsEnums";
import { FollowProfileValidator } from "~/lib/validations/followProfile";

export async function POST(req: Request) {
  try {
    const supabase = createServerComponentClient({
      cookies,
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return new Response(GlobalErrors.UNAUTHORIZED);
    }

    const body = (await req.json()) as { profileId: string };
    const { profileId } = FollowProfileValidator.parse(body);

    const alreadyFollowed = await db.follows.findFirst({
      where: { follower_id: session.user.id, following_id: profileId },
      select: { following_id: true },
    });

    if (alreadyFollowed) {
      await db.follows.delete({
        where: {
          follower_id_following_id: {
            follower_id: session.user.id,
            following_id: profileId,
          },
        },
      });
    } else {
      await db.follows.create({
        data: { follower_id: session.user.id, following_id: profileId },
      });
    }

    // on success
    return new Response(GlobalErrors.SUCCESS);
  } catch (error) {
    return new Response(GlobalErrors.SOMETHING_WENT_WRONG);
  }
}
