"use client";

import { type FC, useEffect, useState } from "react";

import { Loader } from "../ui/Loaders/Loader";

interface FeedStateProps {
  children: React.ReactNode;
  isData: boolean;
}

export const FeedState: FC<FeedStateProps> = ({ children, isData }) => {
  const [dataState, setDataState] = useState<boolean | undefined>(isData);

  useEffect(() => {
    setDataState(undefined);
  }, [children]);

  return !dataState ? <Loader /> : children;
};
