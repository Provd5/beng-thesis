import { cookies } from "next/headers";
import { type bookshelfType } from "@prisma/client";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { db } from "~/lib/db";
import { ChangeBookshelfValidator } from "~/lib/validations/book/changeBookshelf";
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
      formData: { bookId: string; bookshelf: bookshelfType | null };
    };
    const { formData } = ChangeBookshelfValidator.parse(body);

    await db.bookshelf.upsert({
      where: {
        user_id_book_id: { book_id: formData.bookId, user_id: session.user.id },
      },
      update: {
        bookshelf: formData.bookshelf,
      },
      create: {
        book_id: formData.bookId,
        user_id: session.user.id,
        bookshelf: formData.bookshelf,
      },
    });

    // on success
    return new Response(GlobalErrors.SUCCESS);
  } catch (error) {
    return new Response(GlobalErrors.SOMETHING_WENT_WRONG);
  }
}
