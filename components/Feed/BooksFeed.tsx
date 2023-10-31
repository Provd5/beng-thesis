"use client";

import { type FC, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { type bookshelfType } from "@prisma/client";
import axios from "axios";

import {
  type BookCardDataInterface,
  type BookReviewCardDataInterface,
} from "~/types/BookCardDataInterface";

import { GlobalErrors } from "~/lib/validations/errorsEnums";

import { BookCard } from "../Explore/BookCard";
import { BookReviewCard } from "../Explore/BookReviewCard";
import { Loader } from "../ui/Loader";

interface CommonProps {
  orderBy?:
    | "title"
    | "authors"
    | "liked_by_count"
    | "review_count"
    | "published_date"
    | "publisher";
  order?: "desc" | "asc";
}

interface BooksReviewFeedProps extends CommonProps {
  userId?: never;
  profileName: string;
  variant: "REVIEWS";
}
interface BooksFeedProps extends CommonProps {
  userId?: string;
  profileName: string;
  variant: bookshelfType | "OWNED" | "LIKED";
}
interface BooksFeedAllProps extends CommonProps {
  userId?: string;
  profileName?: never;
  variant?: never;
}

export const BooksFeed: FC<
  BooksReviewFeedProps | BooksFeedProps | BooksFeedAllProps
> = ({ userId, profileName, variant, orderBy, order }) => {
  const t = useTranslations("Other");
  const te = useTranslations("Errors");

  const userIdParam = userId ? `&userId=${userId}` : "";
  const profileNameParam = profileName ? `&profileName=${profileName}` : "";
  const variantParam = variant ? `&variant=${variant}` : "";
  const orderByParam = orderBy ? `&orderBy=${orderBy}` : "";
  const orderParam = order ? `&order=${order}` : "";

  const takeLimit = 10;
  const [pageNumber, setPageNumber] = useState(1);

  const [booksData, setBooksData] = useState<
    (BookReviewCardDataInterface | BookCardDataInterface)[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBooks = async () => {
    setIsLoading(true);

    const query =
      `/api/feed/books?takeLimit=${takeLimit}&page=${pageNumber}` +
      userIdParam +
      profileNameParam +
      variantParam +
      orderByParam +
      orderParam;

    await axios
      .get(query)
      .then(
        ({
          data,
        }: {
          data: BookReviewCardDataInterface[] | BookCardDataInterface[];
        }) => {
          setBooksData((prevData) => [...prevData, ...data]);
          setPageNumber(pageNumber + 1);
        }
      )
      .catch(() => te(GlobalErrors.COULD_NOT_FETCH, { item: "books" }))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    void fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {variant === "REVIEWS" ? (
        <div className="grid grid-cols-1 gap-5">
          {booksData?.map((book) => {
            return (
              <BookReviewCard
                key={book.id}
                bookData={book as BookReviewCardDataInterface}
              />
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {booksData?.map((book) => {
            return (
              <BookCard
                key={book.id}
                bookData={book as BookCardDataInterface}
              />
            );
          })}
        </div>
      )}
      {isLoading ? (
        <div className="flex w-full items-center justify-center py-6">
          <Loader className="h-11 w-11" />
        </div>
      ) : (
        takeLimit * pageNumber - 10 <= booksData.length && (
          <div className="flex w-full items-center justify-center py-6">
            <button
              className="rounded-sm border border-secondary px-6 py-3 text-secondary dark:border-secondary-light dark:text-secondary-light"
              onClick={() => fetchBooks()}
            >
              {t("load more")}
            </button>
          </div>
        )
      )}
    </>
  );
};
