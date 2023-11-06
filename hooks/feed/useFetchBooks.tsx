"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { type bookshelfType } from "@prisma/client";
import axios from "axios";

import { GlobalErrors } from "../../lib/validations/errorsEnums";

interface CommonProps {
  takeLimit: number;
  orderBy?: string;
  order?: "desc" | "asc";
}

export type FetchBooksProps = CommonProps & {
  variant: bookshelfType | "OWNED" | "LIKED" | "REVIEWS" | undefined;
  sessionId: string | undefined;
  profileName: string | undefined;
};

export function useFetchBooks({
  takeLimit,
  variant,
  sessionId,
  profileName,
  orderBy,
  order,
}: FetchBooksProps) {
  const te = useTranslations("Errors");

  const isInitialRender = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [fetchedData, setFetchedData] = useState<
    (BookCardInterface | BookReviewCardInterface | BookInterface)[]
  >([]);

  const fetchMore = async () => {
    setIsLoading(true);

    const sessionIdParam = sessionId ? `&sessionId=${sessionId}` : "";
    const profileNameParam = profileName ? `&profileName=${profileName}` : "";
    const variantParam = variant ? `&variant=${variant}` : "";
    const orderByParam = orderBy ? `&orderBy=${orderBy}` : "";
    const orderParam = order ? `&order=${order}` : `&order=desc`;

    const query =
      `/api/feed/books?takeLimit=${takeLimit}&page=${pageNumber}` +
      sessionIdParam +
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
          setFetchedData((prevData) => [...prevData, ...data]);
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
    setFetchedData([]);
    setPageNumber(1);
  }, [order, orderBy]);

  useEffect(() => {
    if (fetchedData.length === 0 && pageNumber === 1) {
      void fetchMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedData, pageNumber]);

  return { fetchedData, isLoading, fetchMore, pageNumber };
}
