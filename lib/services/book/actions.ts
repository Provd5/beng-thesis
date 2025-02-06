"use server";

import { revalidateTag } from "next/cache";

import { type ActionResponseType } from "~/types/actions";

import { db } from "~/lib/db";
import { errorHandler } from "~/lib/errorHandler";
import { OwnedAsValidator } from "~/lib/validations/book";
import { ErrorsToTranslate } from "~/lib/validations/errorsEnums";
import { UuidValidator } from "~/lib/validations/others";

import { getSessionUser } from "../session/queries";

export async function postLike(bookId: unknown): ActionResponseType {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      throw new Error(ErrorsToTranslate.UNAUTHORIZED);
    }

    const validBookId = UuidValidator.parse(bookId);

    const alreadyLiked = await db.liked_books.count({
      where: { book_id: validBookId, user_id: sessionUser.id },
    });

    if (alreadyLiked) {
      await db.liked_books.delete({
        where: {
          user_id_book_id: {
            book_id: validBookId,
            user_id: sessionUser.id,
          },
        },
      });
    } else {
      await db.liked_books.create({
        data: { book_id: validBookId, user_id: sessionUser.id },
      });
    }

    // on success
    revalidateTag("profile");
    revalidateTag("all-reviews");
    revalidateTag("book");
    revalidateTag("all-books");
    revalidateTag("bookshelf-books");
    return { success: true };
  } catch (e) {
    return { success: false, error: errorHandler(e) };
  }
}

export async function postOwnedAs(
  bookId: unknown,
  ownedAs: unknown,
): ActionResponseType {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      throw new Error(ErrorsToTranslate.UNAUTHORIZED);
    }

    const validBookId = UuidValidator.parse(bookId);
    const validData = OwnedAsValidator.parse(ownedAs);
    const ownedAsTypeToManage = `added_${validData.toLowerCase()}_at`;

    const ownedAsData = await db.book_owned_as.findFirst({
      where: { book_id: validBookId, user_id: sessionUser.id },
      select: { [ownedAsTypeToManage]: true },
    });

    const ownedAsExists =
      !!ownedAsData?.added_audiobook_at ||
      !!ownedAsData?.added_book_at ||
      !!ownedAsData?.added_ebook_at;

    await db.book_owned_as.upsert({
      where: {
        user_id_book_id: {
          book_id: validBookId,
          user_id: sessionUser.id,
        },
      },
      update: {
        [ownedAsTypeToManage]: ownedAsExists ? null : new Date(),
      },
      create: {
        book_id: validBookId,
        user_id: sessionUser.id,
        [ownedAsTypeToManage]: new Date(),
      },
    });

    // on success
    revalidateTag("profile");
    revalidateTag("book");
    revalidateTag("all-books");
    revalidateTag("bookshelf-books");
    return { success: true };
  } catch (e) {
    return { success: false, error: errorHandler(e) };
  }
}
