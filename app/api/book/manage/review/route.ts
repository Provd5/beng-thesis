import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { z } from "zod";

import { db } from "~/lib/db";
import {
  CreateReviewResponse,
  CreateReviewValidator,
} from "~/lib/validations/book/manage";
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
      bookId: string;
      text: string;
      score: number;
    };

    const { formData } = CreateReviewValidator.parse(body);

    const reviewExists = await db.review.findFirst({
      where: {
        author_id: session.user.id,
        book_id: formData.bookId,
      },
      select: { id: true },
    });

    // on success
    if (reviewExists) {
      await db.review.update({
        where: { id: reviewExists.id },
        data: {
          text: formData.text,
          score: formData.score,
        },
      });
      return new Response(CreateReviewResponse.UPDATED);
    } else {
      await db.review.create({
        data: {
          author_id: session.user.id,
          book_id: formData.bookId,
          text: formData.text,
          score: formData.score,
        },
      });
      return new Response(CreateReviewResponse.CREATED);
    }
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
