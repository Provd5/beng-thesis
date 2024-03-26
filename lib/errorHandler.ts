import { ZodError } from "zod";

import { ErrorsToTranslate } from "./validations/errorsEnums";

export const errorHandler = (error: unknown): string => {
  let errorMsg: string;

  if (error instanceof ZodError) {
    errorMsg = error.errors[0].message;
  } else if (error instanceof Error) {
    errorMsg = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    errorMsg = String(error.message);
  } else if (typeof error === "string") {
    errorMsg = error;
  } else {
    errorMsg = ErrorsToTranslate.SOMETHING_WENT_WRONG;
  }

  return errorMsg;
};
