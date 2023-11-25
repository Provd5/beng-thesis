import { cookies } from "next/headers";
import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { z } from "zod";

import { db } from "~/lib/db";
import { CreateReviewValidator } from "~/lib/validations/book/createReview";
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
