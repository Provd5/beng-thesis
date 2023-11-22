import { z } from "zod";

export const SearchValidator = z.object({
  searchText: z.string().min(2),
  searchCategory: z.enum(["books", "users"]).nullish(),
});
