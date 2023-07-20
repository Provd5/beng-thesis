import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { z } from "zod";

import { db } from "~/lib/db";
import { UsernameValidator } from "~/lib/validations/auth";
import { AuthErrors } from "~/lib/validations/errorsEnums";

export async function PATCH(req: Request) {
  try {
    const supabase = createServerComponentClient({
      cookies,
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return new Response(AuthErrors.unauthorized);
    }

    const body = await req.text();
    const username = UsernameValidator.parse(body);

    // check if username is taken
    const isUsernameExists = await db.profile.findFirst({
      where: {
        full_name: username,
      },
    });

    if (isUsernameExists) {
      return new Response(AuthErrors.username_exists);
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

    return new Response(username);
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.issues.map((error) => {
        return new Response(error.message);
      });
    } else {
      return new Response(AuthErrors.something_went_wrong);
    }
  }
}
