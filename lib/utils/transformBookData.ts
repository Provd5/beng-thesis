import { type RawGetBookData } from "~/types/data/book";

export const transformBookData = (
  sessionId: string | undefined,
  bookData: RawGetBookData,
) => {
  const _avg_rate = parseFloat(
    (bookData.review.length > 0
      ? bookData.review.reduce(
          (accumulator, currentValue) => accumulator + currentValue.rate,
          0,
        ) / bookData.review.length
      : 0
    ).toFixed(1),
  );

  const sessionReview = bookData.review.filter(
    (r) => r.author_id === sessionId,
  );

  const bookKeys = Object.keys(bookData).filter(
    (key) =>
      !["_count", "review", "book_owned_as", "bookshelf", "liked_by"].includes(
        key,
      ),
  ) as (keyof Omit<
    RawGetBookData,
    "_count" | "review" | "book_owned_as" | "bookshelf" | "liked_by"
  >)[];

  const book = bookKeys.map((key) => {
    return { [key]: bookData[key] };
  });

  const data = Object.assign({}, ...book) as Omit<
    RawGetBookData,
    "_count" | "review" | "book_owned_as" | "bookshelf" | "liked_by"
  >;

  const transformedData = {
    book: data,
    _count: bookData._count,
    _avg_rate,
    review: sessionId
      ? sessionReview.length > 0
        ? sessionReview[0]
        : null
      : undefined,
    book_owned_as: sessionId
      ? bookData.book_owned_as.length > 0
        ? bookData.book_owned_as[0]
        : null
      : undefined,
    bookshelf: sessionId
      ? bookData.bookshelf.length > 0
        ? bookData.bookshelf[0]
        : null
      : undefined,
    liked_by: sessionId
      ? bookData.liked_by.length > 0
        ? bookData.liked_by[0]
        : null
      : undefined,
  };

  return transformedData;
};
