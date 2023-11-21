import { type bookshelfType } from "@prisma/client";

interface FetchCommonProps {
  takeLimit: number;
  orderBy?: string;
  order?: "desc" | "asc";
  variant?: never;
  profileName?: never;
  userId?: never;
  isMyReview?: never;
  bookId?: never;
}

interface FetchBooksProps extends FetchCommonProps {
  variant: bookshelfType | "OWNED" | "LIKED" | "REVIEWS" | undefined;
  profileName: string | undefined;
}

interface FetchProfilesProps extends FetchCommonProps {
  variant: "following" | "followers" | undefined;
  userId: string | undefined;
}

interface FetchReviewsProps extends FetchCommonProps {
  isMyReview?: boolean;
  bookId: string;
}
