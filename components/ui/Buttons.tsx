import type { ButtonHTMLAttributes } from "react";
import React, { forwardRef } from "react";

import { MdKeyboardArrowDown } from "react-icons/md";

import { cn } from "~/utils/cn";

import { Loader } from "./Loaders/Loader";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  loading?: boolean;
  defaultColor?: boolean;
}

const sharedClass =
  "flex items-center justify-center font-semibold whitespace-nowrap h-fit";

type commonSizeTypes = "default" | "sm" | "xs" | "icon";

const commonSizeClass = {
  default: "rounded-2xl px-8 py-3.5 text-base",
  sm: "rounded-xl px-6 py-3 text-sm",
  xs: "rounded-md px-4 py-2 text-sm",
  icon: "rounded-lg p-3 *:size-5",
};
const commonLoadingSizeClass = {
  default: "size-[1.125rem]",
  sm: "size-4",
  xs: "size-4",
  icon: "size-4",
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
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={loading}
        className={cn(
          sharedClass,
          "gap-1 transition-transform hover:scale-105",
          defaultColor && "bg-colors-primary text-white hover:bg-colors-accent",
          commonSizeClass[size],
          className,
        )}
        {...restProps}
      >
        {loading && <Loader className={commonLoadingSizeClass[size]} />}
        {children}
      </button>
    );
  },
);
const ButtonWhite = forwardRef<
  HTMLButtonElement,
  ButtonProps & { size?: commonSizeTypes }
>(({ children, size = "default", loading, className, ...restProps }, ref) => {
  return (
    <button
      ref={ref}
      disabled={loading}
      className={cn(
        sharedClass,
        "gap-1 bg-white text-colors-primary transition-all hover:scale-105 hover:bg-white/80",
        commonSizeClass[size],
        className,
      )}
      {...restProps}
    >
      {loading && (
        <Loader
          className={cn("stroke-colors-primary", commonLoadingSizeClass[size])}
        />
      )}
      {children}
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
    ref,
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
        className={cn(
          "px-1 py-0.5 hover:animate-pulse",
          sharedClass,
          defaultColor && "text-colors-primary",
          sizeClass[size],
          className,
        )}
        {...restProps}
      >
        {children}
        <span className={cn("transition-transform", active && "rotate-180")}>
          <MdKeyboardArrowDown
            className={cn(
              "flex-none text-xl",
              defaultColor && "fill-colors-primary",
            )}
          />
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";
ButtonWhite.displayName = "ButtonWhite";
ButtonLink.displayName = "ButtonLink";
export { Button, ButtonWhite, ButtonLink };
