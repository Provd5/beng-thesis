import { z } from "zod";

export const FollowProfileValidator = z.object({
  profileId: z.string(),
});
