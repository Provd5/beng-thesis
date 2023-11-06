import { z } from "zod";

export const ReviewsValidator = z.object({
  bookId: z.string(),
  userId: z.string().nullish(),
  orderBy: z.enum(["created_at", "score", "review_reaction"]).nullish(),
  order: z.enum(["desc", "asc"]),
  takeLimit: z.string(),
  page: z.string(),
});
