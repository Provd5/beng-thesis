import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { db } from "~/lib/db";
import {
  type ownedAsEnum,
  OwnedAsValidator,
} from "~/lib/validations/book/ownedAs";
import { GlobalErrors } from "~/lib/validations/errorsEnums";

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

    const body = (await req.json()) as {
      formData: { bookId: string; ownedAs: ownedAsEnum };
    };
    const { formData } = OwnedAsValidator.parse(body);

    const propertyToUpdate = `added_${formData.ownedAs.toLowerCase()}_at`;

    await db.book_owned_as.upsert({
      where: {
        user_id_book_id: {
          book_id: formData.bookId,
          user_id: session.user.id,
        },
      },
      update: {
        [propertyToUpdate]: new Date(),
      },
      create: {
        book_id: formData.bookId,
        user_id: session.user.id,
        [propertyToUpdate]: new Date(),
      },
    });

    // on success
    return new Response(GlobalErrors.SUCCESS);
  } catch (error) {
    return new Response(GlobalErrors.SOMETHING_WENT_WRONG);
  }
}
