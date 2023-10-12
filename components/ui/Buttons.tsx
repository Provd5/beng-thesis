import type { ButtonHTMLAttributes } from "react";
import React, { forwardRef } from "react";
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

type commonSizeTypes = "default" | "sm" | "xs";

const commonSizeClass = {
  default: "rounded-xl px-8 py-3.5 text-base",
  sm: "rounded-lg px-6 py-3 text-sm",
  xs: "rounded-sm px-4 py-2 text-sm",
};
const commonLoadingSizeClass = {
  default: "w-[1.125rem] h-[1.125rem]",
  sm: "w-4 h-4",
  xs: "w-4 h-4",
};

const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps & { size?: commonSizeTypes }
>(
  (
    {
      children,
      size = "default",
      loading,
      defaultColor = true,
      className,
      ...restProps
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={loading}
        className={clsx(
          sharedClass,
          "gap-1 hover:scale-105",
          defaultColor &&
            "bg-gradient-dark text-white-light hover:bg-gradient-light dark:bg-gradient-light dark:hover:bg-gradient-dark",
          commonSizeClass[size],
          className
        )}
        {...restProps}
      >
        {loading && <Loader className={commonLoadingSizeClass[size]} />}
        {children}
      </button>
    );
  }
);
const ButtonWhite = forwardRef<
  HTMLButtonElement,
  ButtonProps & { size?: commonSizeTypes }
>(({ children, size = "default", loading, className, ...restProps }, ref) => {
  return (
    <button
      ref={ref}
      disabled={loading}
      className={clsx(
        "bg-white-light hover:scale-105 hover:bg-white-light/80",
        commonSizeClass[size],
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
          <Loader
            className={clsx(
              "stroke-[var(--svg-gradient-dark)]",
              commonLoadingSizeClass[size]
            )}
          />
        )}
        {children}
      </div>
    </button>
  );
});

const ButtonLink = forwardRef<
  HTMLButtonElement,
  ButtonProps & { active?: boolean; size?: "lg" | "default" | "sm" }
>(
  (
    {
      children,
      size = "default",
      defaultColor = true,
      loading,
      className,
      active,
      ...restProps
    },
    ref
  ) => {
    const sizeClass = {
      lg: "text-md",
      default: "text-base",
      sm: "text-sm",
    };

    return (
      <button
        ref={ref}
        disabled={loading}
        className={clsx(
          sharedClass,
          defaultColor && "text-secondary dark:text-secondary-light",
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
              defaultColor && "fill-primary dark:fill-secondary-light"
            )}
          />
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";
ButtonWhite.displayName = "ButtonWhite";
ButtonLink.displayName = "ButtonLink";
export { Button, ButtonWhite, ButtonLink };
