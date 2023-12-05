import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "~/lib/db";
import readUserSession from "~/lib/supabase/readUserSession";
import { CreateReviewValidator } from "~/lib/validations/book/createReview";
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
      bookId: string;
      text: string;
      rate: number;
    };

    const { formData } = CreateReviewValidator.parse(body);

    const reviewExists = await db.review.findFirst({
      where: {
        author_id: session.user.id,
        book_id: formData.bookId,
      },
      select: { id: true },
    });

    if (reviewExists) {
      await db.review.update({
        where: { id: reviewExists.id },
        data: {
          text: formData.text,
          rate: formData.rate,
        },
      });
    } else {
      await db.review.create({
        data: {
          author_id: session.user.id,
          book_id: formData.bookId,
          text: formData.text,
          rate: formData.rate,
          updated_at: null,
        },
      });
    }

    // on success
    revalidatePath("/", "layout");
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
