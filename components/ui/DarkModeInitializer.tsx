"use client";

import { type FC, useEffect } from "react";

export const DarkModeInitializer: FC = () => {
  useEffect(() => {
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, []);

  return null;
};
