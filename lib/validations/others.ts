import { z } from "zod";

export const UuidValidator = z.string().uuid();
