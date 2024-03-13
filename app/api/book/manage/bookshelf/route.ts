import { type bookshelfType } from "@prisma/client";

import { db } from "~/lib/db";
import readUserSession from "~/lib/supabase/readUserSession";
import { ChangeBookshelfValidator } from "~/lib/validations/book/changeBookshelf";
import { GlobalErrors } from "~/lib/validations/errorsEnums";

export async function POST(req: Request) {
  try {
    const {
      data: { session },
    } = await readUserSession();

    if (!session?.user) {
      return new Response(GlobalErrors.UNAUTHORIZED);
    }

    const body = (await req.json()) as {
      formData: {
        bookId: string;
        bookshelf: bookshelfType | null;
        beganReadingAt: string | null;
        updatedAt: string | null;
        readQuantity: number | null;
      };
    };
    const { formData } = ChangeBookshelfValidator.parse(body);

    const upsertData: {
      began_reading_at: Date | null;
      updated_at: Date | null;
      read_quantity: number | null;
    } = {
      began_reading_at: formData.beganReadingAt
        ? new Date(formData.beganReadingAt)
        : null,
      updated_at: formData.updatedAt ? new Date(formData.updatedAt) : null,
      read_quantity: formData.readQuantity,
    };

    // Filter out properties with null values
    const filteredUpsertData = Object.fromEntries(
      Object.entries(upsertData).filter(([_, value]) => value !== null)
    );

    await db.bookshelf.upsert({
      where: {
        user_id_book_id: { book_id: formData.bookId, user_id: session.user.id },
      },
      update: {
        bookshelf: formData.bookshelf,
        ...filteredUpsertData,
      },
      create: {
        book_id: formData.bookId,
        user_id: session.user.id,
        bookshelf: formData.bookshelf,
        ...filteredUpsertData,
      },
    });

    // on success
    // revalidatePath("/", "layout");
    return new Response(GlobalErrors.SUCCESS);
  } catch (error) {
    return new Response(GlobalErrors.SOMETHING_WENT_WRONG);
  }
}
