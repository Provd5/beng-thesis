import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { db } from "~/lib/db";
import { LikeBookValidator, LikeResponse } from "~/lib/validations/book/manage";
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

    const body = (await req.json()) as { bookId: string };
    const { bookId } = LikeBookValidator.parse(body);

    const alreadyLiked = await db.liked_books.findFirst({
      where: { book_id: bookId, user_id: session.user.id },
    });

    if (alreadyLiked) {
      await db.liked_books.delete({
        where: {
          user_id_book_id: { book_id: bookId, user_id: session.user.id },
        },
      });
      return new Response(LikeResponse.REMOVED);
    } else {
      await db.liked_books.create({
        data: { book_id: bookId, user_id: session.user.id },
      });
      return new Response(LikeResponse.ADDED);
    }
  } catch (error) {
    return new Response(GlobalErrors.SOMETHING_WENT_WRONG);
  }
}
