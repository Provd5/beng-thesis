"use server";

import { revalidateTag } from "next/cache";

import { db } from "~/lib/db";
import { errorHandler } from "~/lib/errorHandler";
import { ChangeBookshelfValidator } from "~/lib/validations/bookshelf";
import { ErrorsToTranslate } from "~/lib/validations/errorsEnums";
import { UuidValidator } from "~/lib/validations/others";

import { getSessionUser } from "../session/queries";

export async function changeBookshelf(
  bookId: unknown,
  formData: unknown,
): Promise<{ success: boolean }> {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      throw new Error(ErrorsToTranslate.UNAUTHORIZED);
    }

    const validBookId = UuidValidator.parse(bookId);
    const validData = ChangeBookshelfValidator.parse(formData);

    const validQuantity =
      validData.bookshelf === "ALREADY_READ" && !!validData.read_quantity
        ? validData.read_quantity > 1
          ? validData.read_quantity
          : 1
        : undefined;

    await db.bookshelf.upsert({
      where: {
        user_id_book_id: {
          book_id: validBookId,
          user_id: sessionUser.id,
        },
      },
      update: {
        bookshelf: validData.bookshelf,
        read_quantity: validQuantity,
        updated_at: validData.updated_at,
        began_reading_at: validData.began_reading_at,
      },
      create: {
        book_id: validBookId,
        user_id: sessionUser.id,
        bookshelf: validData.bookshelf,
        read_quantity: validQuantity,
        updated_at: validData.updated_at,
        began_reading_at: validData.began_reading_at,
      },
    });

    // on success
    revalidateTag("session-user");
    return { success: true };
  } catch (e) {
    throw new Error(errorHandler(e));
  }
}
