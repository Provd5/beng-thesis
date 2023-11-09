import { z } from "zod";

export const SearchValidator = z.object({
  searchText: z.string().min(3),
  searchCategory: z.enum(["books", "users"]).nullish(),
  sessionId: z.string().nullish(),
});
