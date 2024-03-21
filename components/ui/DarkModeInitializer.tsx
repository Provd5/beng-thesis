"use client";

import { type FC, useEffect } from "react";

export const DarkModeInitializer: FC = () => {
  const themeInitializerScript = `function initializeDarkMode() { localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark");} initializeDarkMode();`;

  useEffect(() => {
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, []);

  return (
    <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
  );
};
