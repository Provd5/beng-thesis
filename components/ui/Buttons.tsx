import type { ButtonHTMLAttributes, FC } from "react";
import { clsx } from "clsx";

import { MdKeyboardArrowDown } from "react-icons/md";

import { Loader } from "./Loader";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  loading?: boolean;
  defaultColor?: boolean;
}

const sharedClass =
  "flex items-center justify-center font-semibold whitespace-nowrap h-fit";

export const Button: FC<ButtonProps & { size?: "default" | "sm" }> = ({
  children,
  size = "default",
  loading,
  defaultColor = true,
  className,
  ...restProps
}) => {
  const sizeClass = {
    default: "rounded-xl px-8 py-3.5 text-base",
    sm: "rounded-lg px-6 py-3 text-sm",
  };

  return (
    <button
      disabled={loading}
      className={clsx(
        sharedClass,
        "gap-1 hover:scale-105",
        defaultColor &&
          "bg-gradient-dark text-white-light hover:bg-gradient-light dark:bg-gradient-light dark:hover:bg-gradient-dark",
        sizeClass[size],
        className
      )}
      {...restProps}
    >
      {loading && <Loader className="text-md" />}
      {children}
    </button>
  );
};

export const ButtonWhite: FC<ButtonProps & { size?: "default" | "sm" }> = ({
  children,
  size = "default",
  loading,
  className,
  ...restProps
}) => {
  const sizeClass = {
    default: "rounded-xl px-8 py-3.5 text-base",
    sm: "rounded-lg px-6 py-3 text-sm",
  };

  return (
    <button
      disabled={loading}
      className={clsx(
        "bg-white-light hover:scale-105 hover:bg-white-light/80",
        sizeClass[size],
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

export const ButtonLink: FC<
  ButtonProps & { active?: boolean; size?: "default" | "sm" | "lg" }
> = ({
  children,
  size = "default",
  defaultColor = true,
  loading,
  className,
  active,
  ...restProps
}) => {
  const sizeClass = {
    default: "text-base",
    sm: "text-sm",
    lg: "text-md",
  };

  return (
    <button
      disabled={loading}
      className={clsx(
        sharedClass,
        defaultColor &&
          "bg-gradient-dark bg-gradient-dark bg-clip-text text-transparent dark:bg-gradient-light",
        sizeClass[size],
        className
      )}
      {...restProps}
    >
      {children}
      <span className={clsx("transition-transform", active && "rotate-180")}>
        <MdKeyboardArrowDown
          className={clsx(
            "flex-none text-xl",
            defaultColor &&
              "fill-[var(--svg-gradient-dark)] dark:fill-[var(--svg-gradient)]"
          )}
        />
      </span>
    </button>
  );
};
