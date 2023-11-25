import { cookies } from "next/headers";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { db } from "~/lib/db";
import { GlobalErrors } from "~/lib/validations/errorsEnums";
import { FollowProfileValidator } from "~/lib/validations/followProfile";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return new Response(GlobalErrors.UNAUTHORIZED);
    }

    const body = (await req.json()) as { profileId: string };
    const { profileId } = FollowProfileValidator.parse(body);

    if (session.user.id === profileId) {
      return new Response(GlobalErrors.SOMETHING_WENT_WRONG);
    }

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
