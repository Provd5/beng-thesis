import { errorHandler } from "~/lib/errorHandler";

export const translatableError = (error: unknown): string => {
  const errorMsg = errorHandler(error).toLowerCase();

  return errorMsg;
};
