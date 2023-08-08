import { type bookshelfType } from "@prisma/client";

export type categoryTypes =
  | bookshelfType
  | "OWNED"
  | "LIKED"
  | "REVIEWS"
  | "STATISTICS";
