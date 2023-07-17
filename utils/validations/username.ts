import { z } from "zod";

export const UsernameValidator = z
  .string()
  .min(3)
  .max(32)
  .regex(/^[a-zA-Z0-9_]+$/);
