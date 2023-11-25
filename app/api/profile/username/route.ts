import { z } from "zod";

import { db } from "~/lib/db";
import readUserSession from "~/lib/supabase/readUserSession";
import { UsernameValidator } from "~/lib/validations/auth";
import { AuthErrors, GlobalErrors } from "~/lib/validations/errorsEnums";

export async function PATCH(req: Request) {
  try {
    const {
      data: { session },
    } = await readUserSession();

    if (!session?.user) {
      return new Response(GlobalErrors.UNAUTHORIZED);
    }

    const body = (await req.json()) as { username: string };
    const { username } = UsernameValidator.parse(body);

    // check if username is taken
    const isUsernameExists = await db.profile.findFirst({
      where: {
        full_name: { equals: username, mode: "insensitive" },
      },
      select: { full_name: true },
    });

    if (isUsernameExists) {
      return new Response(AuthErrors.USERNAME_EXISTS);
    }

    // update username
    await db.profile.update({
      where: {
        id: session.user.id,
      },
      data: {
        full_name: username,
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
