import { z } from "zod";

import { AuthValidationErrors } from "./errorsEnums";

export const LoginValidator = z.object({
  formData: z.object({
    email: z.string().email({ message: AuthValidationErrors.wrong_email }),
    password: z
      .string()
      .nonempty({ message: AuthValidationErrors.password_required_error }),
  }),
});

export const SignupValidator = z.object({
  formData: z.object({
    email: z.string().email({ message: AuthValidationErrors.wrong_email }),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?])[A-Za-z\d!@#$%^&*()_\-+=<>?]{10,}$/,
        { message: AuthValidationErrors.wrong_password }
      ), // at least 10 characters, one number, one special character, both lower and uppercase letters
  }),
});

export const UsernameValidator = z
  .string()
  .min(3, { message: AuthValidationErrors.username_too_short_3 })
  .max(32, { message: AuthValidationErrors.username_too_long_32 })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: AuthValidationErrors.wrong_username,
  }); // only numbers, lower and uppercase letters
