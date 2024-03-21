import type { FC } from "react";

import { HIGHEST_REVIEW_RATE } from "~/types/data/review";

import { BookService } from "~/lib/services/book";

import { AverageRateLabel } from "./AverageRateLabel";

interface AverageRateProps {
  bookId: string;
}

export const AverageRate: FC<AverageRateProps> = async ({ bookId }) => {
  const bookService = new BookService();
  const averageRate = await bookService.getAverageRate(bookId);

  return (
    <div className="flex flex-col pt-0.5">
      <AverageRateLabel />
      <p className="text-md">{`${averageRate}/${HIGHEST_REVIEW_RATE}`}</p>
    </div>
  );
};
