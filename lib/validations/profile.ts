import { z } from "zod";

import { ErrorsToTranslate } from "./errorsEnums";

export type EditProfileValidatorType = z.infer<typeof EditProfileValidator>;
export const EditProfileValidator = z.object({
  private: z.boolean(),
  username: z
    .string()
    .min(3, { message: ErrorsToTranslate.EDIT_PROFILE.USERNAME_IS_TOO_SHORT })
    .max(32, { message: ErrorsToTranslate.EDIT_PROFILE.USERNAME_IS_TOO_LONG })
    .regex(/^[^\s!@#$%^&*()|\\{}\[\]:;<>/?,+=]+$/, {
      message: ErrorsToTranslate.EDIT_PROFILE.USERNAME_IS_INVALID,
    }), // can contain both lower and uppercase letters (a-z), numbers (0-9), and (".", "_", "-")
  description: z
    .string()
    .max(5000, {
      message: ErrorsToTranslate.EDIT_PROFILE.DESCRIPTION_IS_TOO_LONG,
    })
    .transform((text) => {
      if (text === "") return null;
      return text;
    }),
});
