import { reactionType } from "@prisma/client";
import { z } from "zod";

export const ReviewReactionValidator = z.object({
  formData: z.object({
    reviewId: z.string(),
    reaction: z.enum([reactionType.MEH, reactionType.OK]),
  }),
});
