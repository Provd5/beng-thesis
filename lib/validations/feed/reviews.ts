import { z } from "zod";

export const ReviewsValidator = z.object({
  bookId: z.string(),
  isMyReview: z.string().nullish(),
  orderBy: z
    .enum(["profile_traffic", "created_at", "rate", "review_reaction"])
    .nullish(),
  order: z.enum(["desc", "asc"]),
  takeLimit: z.string(),
  page: z.string(),
});
