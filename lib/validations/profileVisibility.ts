import { z } from "zod";

export const ProfileVisibilityValidator = z.object({
  isPrivate: z.boolean(),
});
