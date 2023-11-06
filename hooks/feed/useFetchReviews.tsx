"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import axios from "axios";

import { type ReviewCardDataInterface } from "~/types/feed/ReviewCardDataInterface";

import { GlobalErrors } from "../../lib/validations/errorsEnums";

interface CommonProps {
  takeLimit: number;
  orderBy?: string;
  order?: "desc" | "asc";
}

export interface FetchReviewsProps extends CommonProps {
  bookId: string;
  userId?: string;
}

export function useFetchReviews({
  bookId,
  takeLimit,
  userId,
  orderBy,
  order,
}: FetchReviewsProps) {
  const te = useTranslations("Errors");

  const isInitialRender = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [fetchedData, setFetchedData] = useState<ReviewCardDataInterface[]>([]);

  const fetchMore = async () => {
    setIsLoading(true);

    const userIdParam = userId ? `&userId=${userId}` : "";
    const orderByParam = orderBy ? `&orderBy=${orderBy}` : "";
    const orderParam = order ? `&order=${order}` : `&order=desc`;

    const query =
      `/api/feed/reviews?takeLimit=${takeLimit}&page=${pageNumber}&bookId=${bookId}` +
      userIdParam +
      orderByParam +
      orderParam;

    await axios
      .get(query)
      .then(({ data }: { data: ReviewCardDataInterface[] }) => {
        setFetchedData((prevData) => [...prevData, ...data]);
        setPageNumber((prev) => prev + 1);
      })
      .catch(() =>
        toast.error(te(GlobalErrors.COULD_NOT_FETCH, { item: "reviews" }))
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
