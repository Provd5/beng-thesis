import { db } from "~/lib/db";
import readUserSession from "~/lib/supabase/readUserSession";
import { DeleteReviewValidator } from "~/lib/validations/book/createReview";
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
    };

    const { bookId } = DeleteReviewValidator.parse(body);

    const reviewExists = await db.review.findFirst({
      where: {
        author_id: session.user.id,
        book_id: bookId,
      },
      select: { id: true },
    });

    if (reviewExists) {
      await db.review.delete({
        where: {
          id: reviewExists.id,
        },
      });
    }

    // on success
    // revalidatePath("/", "layout");
    return new Response(GlobalErrors.SUCCESS);
  } catch (error) {
    return new Response(GlobalErrors.SOMETHING_WENT_WRONG);
  }
}
