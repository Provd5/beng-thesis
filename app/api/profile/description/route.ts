import { z } from "zod";

import { db } from "~/lib/db";
import readUserSession from "~/lib/supabase/readUserSession";
import { DescriptionValidator } from "~/lib/validations/auth";
import { GlobalErrors } from "~/lib/validations/errorsEnums";

export async function PATCH(req: Request) {
  try {
    const {
      data: { session },
    } = await readUserSession();

    if (!session?.user) {
      return new Response(GlobalErrors.UNAUTHORIZED);
    }

    const body = (await req.json()) as { description: string | null };
    const { description } = DescriptionValidator.parse(body);

    // update description
    await db.profile.update({
      where: {
        id: session.user.id,
      },
      data: {
        description: description,
      },
    });

    // on success
    // revalidatePath("/", "layout");
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
