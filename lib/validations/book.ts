import { z } from "zod";

import { OwnedAsArray } from "~/types/consts";

import { ErrorsToTranslate } from "./errorsEnums";

export const OwnedAsValidator = z.enum(OwnedAsArray, {
  errorMap: () => ({ message: ErrorsToTranslate.DATA_TYPES.DATA_IS_INVALID }),
});
