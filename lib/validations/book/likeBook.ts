import { z } from "zod";

export const LikeBookValidator = z.object({
  bookId: z.string(),
});
