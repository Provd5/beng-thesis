import { cookies } from "next/headers";
import { type reactionType } from "@prisma/client";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { db } from "~/lib/db";
import { ReviewReactionValidator } from "~/lib/validations/book/reviewReaction";
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
      formData: { reviewId: string; reaction: reactionType };
    };
    const { formData } = ReviewReactionValidator.parse(body);

    const currentReaction = await db.review_reaction.findFirst({
      where: { review_id: formData.reviewId, user_id: session.user.id },
    });

    if (currentReaction && currentReaction.reaction === formData.reaction) {
      await db.review_reaction.delete({
        where: {
          user_id_review_id: {
            review_id: formData.reviewId,
            user_id: session.user.id,
          },
        },
      });
    } else {
      await db.review_reaction.upsert({
        where: {
          user_id_review_id: {
            review_id: formData.reviewId,
            user_id: session.user.id,
          },
        },
        update: {
          reaction: formData.reaction,
        },
        create: {
          review_id: formData.reviewId,
          user_id: session.user.id,
          reaction: formData.reaction,
        },
      });
    }

    // on success
    return new Response(GlobalErrors.SUCCESS);
  } catch (error) {
    return new Response(GlobalErrors.SOMETHING_WENT_WRONG);
  }
}
