import { cookies } from "next/headers";
import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { z } from "zod";

import { db } from "~/lib/db";
import { GlobalErrors } from "~/lib/validations/errorsEnums";
import { ProfileVisibilityValidator } from "~/lib/validations/profileVisibility";

export async function PATCH(req: Request) {
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

    const body = (await req.json()) as { isPrivate: boolean };
    const { isPrivate } = ProfileVisibilityValidator.parse(body);

    // update username
    await db.profile.update({
      where: {
        id: session.user.id,
      },
      data: {
        private: isPrivate,
      },
    });

    return new Response(GlobalErrors.SUCCESS);
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.issues.map((error) => {
        return new Response(error.message);
      });
    } else {
      return new Response(GlobalErrors.SOMETHING_WENT_WRONG);
    }
  }
}
