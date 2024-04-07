import { z } from "zod";

import { ErrorsToTranslate } from "./errorsEnums";

export type LoginValidatorType = z.infer<typeof LoginValidator>;
export const LoginValidator = z.object({
  email: z.string().email({ message: ErrorsToTranslate.AUTH.EMAIL_IS_INVALID }),
  password: z
    .string()
    .min(1, { message: ErrorsToTranslate.AUTH.PASSWORD_IS_REQUIRED }),
});

export type SignupValidatorType = z.infer<typeof SignupValidator>;
export const SignupValidator = z.object({
  email: z.string().email({ message: ErrorsToTranslate.AUTH.EMAIL_IS_INVALID }),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?])[A-Za-z\d!@#$%^&*()_\-+=<>?]{10,}$/,
      { message: ErrorsToTranslate.AUTH.PASSWORD_IS_INVALID }
    ), // at least 10 characters, one number, one special character, both lower and uppercase letters
  repeat_password: z.string().min(1),
});
