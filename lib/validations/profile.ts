import { z } from "zod";

import {
  DescriptionValidatorErrors,
  UsernameValidatorErrors,
} from "./errorsEnums";

export type EditProfileValidatorType = z.infer<typeof EditProfileValidator>;
export const EditProfileValidator = z.object({
  private: z.boolean(),
  username: z
    .string()
    .min(3, { message: UsernameValidatorErrors.USERNAME_TOO_SHORT_3 })
    .max(32, { message: UsernameValidatorErrors.USERNAME_TOO_LONG_32 })
    .regex(/^[^\s!@#$%^&*()|\\{}\[\]:;<>/?,+=]+$/, {
      message: UsernameValidatorErrors.WRONG_USERNAME,
    }), // can contain both lower and uppercase letters (a-z), numbers (0-9), and (".", "_", "-")
  description: z
    .string()
    .max(5000, {
      message: DescriptionValidatorErrors.DESCRIPTION_TOO_LONG_5000,
    })
    .nullable(),
});

export type FollowProfileValidatorType = z.infer<typeof FollowProfileValidator>;
export const FollowProfileValidator = z.object({
  profileId: z.string().uuid(),
});
