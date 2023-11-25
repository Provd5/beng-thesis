import { cookies } from "next/headers";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { type OwnedAsType } from "~/types/CategoryTypes";

import { db } from "~/lib/db";
import { OwnedAsValidator } from "~/lib/validations/book/ownedAs";
import { GlobalErrors } from "~/lib/validations/errorsEnums";

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

    const body = (await req.json()) as {
      formData: { bookId: string; ownedAs: OwnedAsType };
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
