import type { ButtonHTMLAttributes, FC } from "react";
import { clsx } from "clsx";

import { MdKeyboardArrowDown } from "react-icons/md";

import { Loader } from "./Loader";

type sizes = "default" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  size?: sizes;
  loading?: boolean;
  defaultColor?: boolean;
}

const sharedClass =
  "flex items-center justify-center font-semibold whitespace-nowrap";

export const Button: FC<ButtonProps> = ({
  children,
  size = "default",
  loading,
  defaultColor = true,
  className,
  ...restProps
}) => {
  return (
    <button
      disabled={loading}
      className={clsx(
        sharedClass,
        "gap-1 hover:scale-105",
        defaultColor &&
          "bg-gradient-dark text-white-light hover:bg-gradient-light dark:bg-gradient-light dark:hover:bg-gradient-dark",
        size === "default"
          ? "rounded-xl px-8 py-3.5 text-base"
          : "rounded-lg px-6 py-3 text-sm",
        className
      )}
      {...restProps}
    >
      {loading && <Loader className="text-md" />}
      {children}
    </button>
  );
};

export const ButtonWhite: FC<ButtonProps> = ({
  children,
  size = "default",
  loading,
  className,
  ...restProps
}) => {
  return (
    <button
      disabled={loading}
      className={clsx(
        "bg-white-light hover:scale-105 hover:bg-white-light/80",
        size === "default"
          ? "rounded-xl px-8 py-3.5 text-base"
          : "rounded-lg px-6 py-3 text-sm",
        className
      )}
      {...restProps}
    >
      <div
        className={clsx(
          sharedClass,
          "flex gap-1 bg-gradient-dark bg-clip-text text-transparent"
        )}
      >
        {loading && (
          <Loader className="stroke-[var(--svg-gradient-dark)] text-md" />
        )}
        {children}
      </div>
    </button>
  );
};

export const ButtonLink: FC<ButtonProps & { active?: boolean }> = ({
  children,
  size = "default",
  loading,
  className,
  active,
  ...restProps
}) => {
  return (
    <button
      disabled={loading}
      className={clsx(
        sharedClass,
        "bg-gradient-dark bg-gradient-dark bg-clip-text text-transparent hover:font-bold dark:bg-gradient-light",
        size === "default" ? "text-base" : "text-sm",
        className
      )}
      {...restProps}
    >
      {children}
      <span className={active ? "rotate-180" : ""}>
        <MdKeyboardArrowDown className="flex-none fill-[var(--svg-gradient-dark)] text-xl dark:fill-[var(--svg-gradient)]" />
      </span>
    </button>
  );
};
