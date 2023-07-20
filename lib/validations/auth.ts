import { z } from "zod";

import {
  LoginValidatorErrors,
  SignupValidatorErrors,
  UsernameValidatorErrors,
} from "./errorsEnums";

export const LoginValidator = z.object({
  formData: z.object({
    email: z.string().email({ message: LoginValidatorErrors.wrong_email }),
    password: z
      .string()
      .nonempty({ message: LoginValidatorErrors.password_required_error }),
  }),
});

export const SignupValidator = z.object({
  formData: z.object({
    email: z.string().email({ message: SignupValidatorErrors.wrong_email }),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?])[A-Za-z\d!@#$%^&*()_\-+=<>?]{10,}$/,
        { message: SignupValidatorErrors.wrong_password }
      ), // at least 10 characters, one number, one special character, both lower and uppercase letters
  }),
});

export const UsernameValidator = z
  .string()
  .min(3, { message: UsernameValidatorErrors.username_too_short_3 })
  .max(32, { message: UsernameValidatorErrors.username_too_long_32 })
  .regex(/^[A-Za-z0-9\.]+$/, {
    message: UsernameValidatorErrors.wrong_username,
  }); // can contain letters (a-z), numbers (0-9), and periods (.)
