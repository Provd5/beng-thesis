"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import axios from "axios";

import {
  type FetchBooksProps,
  type FetchProfilesProps,
  type FetchReviewsProps,
} from "~/types/feed/FetchProps";
import { type ReviewCardDataInterface } from "~/types/feed/ReviewCardDataInterface";

import { GlobalErrors } from "../lib/validations/errorsEnums";

type UseFetchProps =
  | ({
      fetchType: "profiles";
    } & FetchProfilesProps)
  | ({
      fetchType: "books";
    } & FetchBooksProps)
  | ({
      fetchType: "reviews";
    } & FetchReviewsProps);

type FetchedDataTypes<T> = T extends "profiles"
  ? ProfileCardDataInterface[]
  : T extends "books"
  ? (BookCardInterface | BookReviewCardInterface | BookInterface)[]
  : T extends "reviews"
  ? ReviewCardDataInterface[]
  : never;

export function useFetchData({
  fetchType,
  takeLimit,
  orderBy,
  order,
  profileName,
  variant,
  isMyReview,
  userId,
  sessionId,
  bookId,
}: UseFetchProps) {
  const te = useTranslations("Errors");

  const isInitialRender = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [fetchedData, setFetchedData] = useState<
    FetchedDataTypes<typeof fetchType>
  >([]);

  const fetchMore = async () => {
    // Skip the first render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    setIsLoading(true);

    const orderByParam = orderBy ? `&orderBy=${orderBy}` : "";
    const orderParam = order ? `&order=${order}` : `&order=desc`;

    const query =
      `/api/feed/${fetchType}?takeLimit=${takeLimit}&page=${pageNumber}` +
      orderByParam +
      orderParam +
      (variant ? `&variant=${variant}` : "") +
      (sessionId ? `&sessionId=${sessionId}` : "") +
      (profileName ? `&profileName=${profileName}` : "") +
      (userId ? `&userId=${userId}` : "") +
      (isMyReview ? `&isMyReview=true` : "") +
      (bookId ? `&bookId=${bookId}` : "");

    await axios
      .get(query)
      .then(({ data }: { data: FetchedDataTypes<typeof fetchType> }) => {
        if (!data) throw new Error();

        setFetchedData(
          (prevData) =>
            [...prevData, ...data] as FetchedDataTypes<typeof fetchType>
        );
        setPageNumber((prev) => prev + 1);
      })
      .catch(() =>
        toast.error(te(GlobalErrors.COULD_NOT_FETCH, { item: fetchType }))
      )
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    setFetchedData([]);
    setPageNumber(1);
  }, [order, orderBy]);

  useEffect(() => {
    if (pageNumber === 1) void fetchMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, order, orderBy]);

  return { fetchedData, isLoading, fetchMore, pageNumber };
}
