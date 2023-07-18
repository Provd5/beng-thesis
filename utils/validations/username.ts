import { z } from "zod";

export enum UsernameValidatorErrors {
  too_short = "too_short",
  too_long = "too_long",
  wrong_username = "wrong_username",
}

export const UsernameValidator = z
  .string()
  .min(3, { message: UsernameValidatorErrors.too_short })
  .max(32, { message: UsernameValidatorErrors.too_long })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: UsernameValidatorErrors.wrong_username,
  }); // only numbers, lower and uppercase letters
