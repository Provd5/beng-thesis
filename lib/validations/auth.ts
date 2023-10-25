import { z } from "zod";

import {
  DescriptionValidatorErrors,
  LoginValidatorErrors,
  SignupValidatorErrors,
  UsernameValidatorErrors,
} from "./errorsEnums";

export const LoginValidator = z.object({
  formData: z.object({
    email: z.string().email({ message: LoginValidatorErrors.WRONG_EMAIL }),
    password: z
      .string()
      .nonempty({ message: LoginValidatorErrors.PASSWORD_REQUIRED_ERROR }),
  }),
});

export const SignupValidator = z.object({
  formData: z.object({
    email: z.string().email({ message: SignupValidatorErrors.WRONG_EMAIL }),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?])[A-Za-z\d!@#$%^&*()_\-+=<>?]{10,}$/,
        { message: SignupValidatorErrors.WRONG_PASSWORD }
      ), // at least 10 characters, one number, one special character, both lower and uppercase letters
  }),
});

export const UsernameValidator = z.object({
  username: z
    .string()
    .min(3, { message: UsernameValidatorErrors.USERNAME_TOO_SHORT_3 })
    .max(32, { message: UsernameValidatorErrors.USERNAME_TOO_LONG_32 })
    .regex(/^(?!.*\.\.)[a-zA-Z0-9._-]+$/, {
      message: UsernameValidatorErrors.WRONG_USERNAME,
    }), // can contain both lower and uppercase letters (a-z), numbers (0-9), and (".", "_", "-")
});

export const DescriptionValidator = z.object({
  description: z
    .string()
    .nonempty()
    .max(5000, {
      message: DescriptionValidatorErrors.DESCRIPTION_TOO_LONG_5000,
    })
    .nullable(),
});
