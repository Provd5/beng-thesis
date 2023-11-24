import { z } from "zod";

export const ProfilesValidator = z.object({
  userId: z.string().nullish(),
  variant: z.enum(["following", "followers"]).nullish(),
  orderBy: z
    .enum([
      "profile_traffic",
      "book_owned_as",
      "bookshelf",
      "followed_by",
      "review",
      "full_name",
    ])
    .nullish(),
  order: z.enum(["desc", "asc"]),
  takeLimit: z.string(),
  page: z.string(),
});
