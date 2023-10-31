import { z } from "zod";

export const BooksValidator = z.object({
  userId: z.string().nullish(),
  profileName: z.string().nullish(),
  variant: z
    .enum([
      "ALREADY_READ",
      "TO_READ",
      "ABANDONED",
      "READING",
      "OTHER",
      "OWNED",
      "LIKED",
      "REVIEWS",
    ])
    .nullish(),
  orderBy: z
    .enum([
      "title",
      "authors",
      "liked_by_count",
      "review_count",
      "published_date",
      "publisher",
    ])
    .nullish(),
  order: z.enum(["desc", "asc"]).nullish(),
  takeLimit: z.string(),
  page: z.string(),
});
