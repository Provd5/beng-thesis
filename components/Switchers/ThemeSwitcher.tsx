"use client";

import { type Dispatch, type FC, type SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";

import { type IconType } from "react-icons/lib";
import { FaSun } from "react-icons/fa";
import { IoDesktop } from "react-icons/io5";
import { MdNightsStay } from "react-icons/md";

import { SvgPainterWithIcon } from "../ui/SvgPainter";

type themeTypes = "default" | "light" | "dark";

export const ThemeSwitcher: FC = () => {
  const [currentTheme, setCurrentTheme] = useState<themeTypes>(
    (localStorage.theme as themeTypes) || "default"
  );

  return (
    <>
      <div className="flex flex-col gap-3 text-base">
        <ThemeButton
          setCurrentTheme={setCurrentTheme}
          active={currentTheme === "default"}
          Icon={IoDesktop}
          theme={"default"}
        />
        <ThemeButton
          setCurrentTheme={setCurrentTheme}
          active={currentTheme === "light"}
          Icon={FaSun}
          theme={"light"}
        />
        <ThemeButton
          setCurrentTheme={setCurrentTheme}
          active={currentTheme === "dark"}
          Icon={MdNightsStay}
          theme={"dark"}
        />
      </div>
    </>
  );
};

interface ThemeButtonProps {
  Icon: IconType;
  theme: themeTypes;
  setCurrentTheme: Dispatch<SetStateAction<themeTypes>>;
  active: boolean;
}

const ThemeButton: FC<ThemeButtonProps> = ({
  Icon,
  theme,
  setCurrentTheme,
  active,
}) => {
  const t = useTranslations("Theme");

  const handleToggleTheme = (theme: themeTypes) => {
    if (theme === "default") {
      localStorage.removeItem("theme");
      setCurrentTheme("default");
    }

    if (theme === "light") {
      localStorage.theme = "light";
      setCurrentTheme("light");
    }

    if (theme === "dark") {
      localStorage.theme = "dark";
      setCurrentTheme("dark");
    }

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
    <button
      className="flex items-center gap-1"
      onClick={() => handleToggleTheme(theme)}
    >
      <SvgPainterWithIcon
        Icon={Icon}
        textSize="text-lg"
        className={!active ? "fill-black-light dark:fill-white" : ""}
      />

      <p
        className={
          active
            ? "bg-gradient-dark bg-clip-text text-transparent dark:bg-gradient-light"
            : ""
        }
      >
        {theme === "dark" && t("dark")}
        {theme === "default" && t("default")}
        {theme === "light" && t("light")}
      </p>
    </button>
  );
};
