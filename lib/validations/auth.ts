import { z } from "zod";

import { LoginValidatorErrors, SignupValidatorErrors } from "./errorsEnums";

export type LoginValidatorType = z.infer<typeof LoginValidator>;
export const LoginValidator = z.object({
  email: z.string().email({ message: LoginValidatorErrors.WRONG_EMAIL }),
  password: z.string().min(1, LoginValidatorErrors.PASSWORD_REQUIRED_ERROR),
});

export type SignupValidatorType = z.infer<typeof SignupValidator>;
export const SignupValidator = z.object({
  email: z.string().email({ message: SignupValidatorErrors.WRONG_EMAIL }),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?])[A-Za-z\d!@#$%^&*()_\-+=<>?]{10,}$/,
      { message: SignupValidatorErrors.WRONG_PASSWORD }
    ), // at least 10 characters, one number, one special character, both lower and uppercase letters
  repeat_password: z.string().min(1),
});
