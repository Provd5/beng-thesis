import { z } from "zod";

export const BooksValidator = z.object({
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
      "last_added",
      "popularity",
      "liked_by",
      "review",
      "published_date",
      "title",
      "authors",
    ])
    .nullish(),
  order: z.enum(["desc", "asc"]),
  takeLimit: z.string(),
  page: z.string(),
});
