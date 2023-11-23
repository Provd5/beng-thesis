"use client";

import { type FC, useEffect } from "react";

interface DarkModeInitializerProps {
  preferTheme: string | null;
}

export const DarkModeInitializer: FC<DarkModeInitializerProps> = ({
  preferTheme,
}) => {
  useEffect(() => {
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      (window.matchMedia("(prefers-color-scheme: dark)").matches ||
        preferTheme === "dark"))
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [preferTheme]);

  return null;
};
