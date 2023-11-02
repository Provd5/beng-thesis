"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { type bookshelfType } from "@prisma/client";
import axios from "axios";

import {
  type BookCardInterface,
  type BookInterface,
  type BookReviewCardInterface,
} from "~/types/BookCardDataInterface";
import { type BookOrderVariantType } from "~/types/feed/OrderVariants";

import { GlobalErrors } from "../../lib/validations/errorsEnums";

interface CommonProps {
  takeLimit: number;
  orderBy?: BookOrderVariantType;
  order?: "desc" | "asc";
}

export interface FetchBooksProps extends CommonProps {
  variant?: bookshelfType | "OWNED" | "LIKED" | "REVIEWS";
  userId?: string;
  profileName?: string;
}

interface ReturnedDataProps {
  booksData: (BookCardInterface | BookReviewCardInterface | BookInterface)[];
  isLoading: boolean;
  fetchBooks: () => void;
  pageNumber: number;
}

export function useFetchBooks({
  takeLimit,
  variant,
  userId,
  profileName,
  orderBy,
  order,
}: FetchBooksProps): ReturnedDataProps {
  const te = useTranslations("Errors");

  const isInitialRender = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [booksData, setBooksData] = useState<
    (BookCardInterface | BookReviewCardInterface | BookInterface)[]
  >([]);

  const fetchBooks = async () => {
    setIsLoading(true);

    const userIdParam = userId ? `&userId=${userId}` : "";
    const profileNameParam = profileName ? `&profileName=${profileName}` : "";
    const variantParam = variant ? `&variant=${variant}` : "";
    const orderByParam = orderBy ? `&orderBy=${orderBy}` : "";
    const orderParam = order ? `&order=${order}` : `&order=desc`;

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
          data: (BookCardInterface | BookReviewCardInterface | BookInterface)[];
        }) => {
          setBooksData((prevData) => [...prevData, ...data]);
          setPageNumber((prev) => prev + 1);
        }
      )
      .catch(() =>
        toast.error(te(GlobalErrors.COULD_NOT_FETCH, { item: "books" }))
      )
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    // Skip the first render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    setBooksData([]);
    setPageNumber(1);
  }, [order, orderBy]);

  useEffect(() => {
    if (booksData.length === 0 && pageNumber === 1) {
      void fetchBooks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booksData, pageNumber]);

  return { booksData, isLoading, fetchBooks, pageNumber };
}
