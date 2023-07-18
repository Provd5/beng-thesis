import { z } from "zod";

export enum AuthValidationErrors {
  password_required_error = "password_required_error",
  wrong_email = "wrong_email",
  wrong_password = "wrong_password",
  password_too_short = "password_too_short",
}

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
      .min(10, { message: AuthValidationErrors.password_too_short })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?])[A-Za-z\d!@#$%^&*()_\-+=<>?]{10,}$/,
        { message: AuthValidationErrors.wrong_password }
      ), // at least one number, one special character, both lower and uppercase letters
  }),
});
