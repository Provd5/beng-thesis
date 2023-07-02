"use client";

import type { FC } from "react";

interface ThemeSwitcherProps {
  className?: string;
}

export const ThemeSwitcher: FC<ThemeSwitcherProps> = ({ className }) => {
  const handleToggleTheme = (theme: "system" | "light" | "dark") => {
    if (theme === "system") localStorage.removeItem("theme");

    if (theme === "light") localStorage.theme = "light";

    if (theme === "dark") localStorage.theme = "dark";

    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <>
      <div className={className}>
        <button onClick={() => handleToggleTheme("system")}>system</button>
        <button onClick={() => handleToggleTheme("light")}>light</button>
        <button onClick={() => handleToggleTheme("dark")}>dark</button>
      </div>
    </>
  );
};
