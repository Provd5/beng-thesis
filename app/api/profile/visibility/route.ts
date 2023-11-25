import { z } from "zod";

import { db } from "~/lib/db";
import readUserSession from "~/lib/supabase/readUserSession";
import { GlobalErrors } from "~/lib/validations/errorsEnums";
import { ProfileVisibilityValidator } from "~/lib/validations/profileVisibility";

export async function PATCH(req: Request) {
  try {
    const {
      data: { session },
    } = await readUserSession();

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
