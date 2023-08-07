import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { db } from "~/lib/db";
import {
  type ownedAsType,
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
      formData: { bookId: string; ownedAs: ownedAsType };
    };
    const { formData } = OwnedAsValidator.parse(body);

    const ownedAsTypeToManage = `added_${formData.ownedAs.toLowerCase()}_at`;

    const ownedAsData = await db.book_owned_as.findFirst({
      where: { book_id: formData.bookId, user_id: session.user.id },
      select: { [ownedAsTypeToManage]: true },
    });

    const ownedAsExists =
      !!ownedAsData?.added_audiobook_at ||
      !!ownedAsData?.added_book_at ||
      !!ownedAsData?.added_ebook_at;

    await db.book_owned_as.upsert({
      where: {
        user_id_book_id: {
          book_id: formData.bookId,
          user_id: session.user.id,
        },
      },
      update: {
        [ownedAsTypeToManage]: ownedAsExists ? null : new Date(),
      },
      create: {
        book_id: formData.bookId,
        user_id: session.user.id,
        [ownedAsTypeToManage]: new Date(),
      },
    });

    // on success
    return new Response(GlobalErrors.SUCCESS);
  } catch (error) {
    return new Response(GlobalErrors.SOMETHING_WENT_WRONG);
  }
}
