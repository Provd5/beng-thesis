import type { ButtonHTMLAttributes, FC } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

import { Loader } from "./Loader";

type sizes = "default" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  size?: sizes;
  loading?: boolean;
  className?: string;
}

const sharedClass =
  " flex items-center justify-center transition-transform font-semibold whitespace-nowrap";

export const Button: FC<ButtonProps> = ({
  children,
  size = "default",
  loading = false,
  className,
  ...restProps
}) => {
  return (
    <button
      disabled={loading}
      className={
        (className ?? "") +
        sharedClass +
        " gap-1 bg-gradient-dark text-white-light hover:scale-105 hover:bg-gradient-light dark:bg-gradient-light dark:hover:bg-gradient-dark " +
        (size === "default"
          ? "rounded-xl px-8 py-3.5 text-base"
          : "rounded-lg px-6 py-3 text-sm")
      }
      {...restProps}
    >
      {loading && (
        <div className="h-4 w-4 flex-none">
          <Loader />
        </div>
      )}
      {children}
    </button>
  );
};

export const ButtonWithColor: FC<ButtonProps> = ({
  children,
  size = "default",
  loading = false,
  className,
  ...restProps
}) => {
  return (
    <button
      disabled={loading}
      className={
        (className ?? "") +
        " bg-white-light hover:scale-105 hover:bg-white-light/80 " +
        (size === "default"
          ? "rounded-xl px-8 py-3.5 text-base"
          : "rounded-lg px-6 py-3 text-sm")
      }
      {...restProps}
    >
      <div
        className={
          sharedClass +
          " flex gap-1 bg-gradient-dark bg-clip-text text-transparent"
        }
      >
        {loading && (
          <div className="h-4 w-4 flex-none">
            <Loader className="svg-gradient-stroke" />
          </div>
        )}
        {children}
      </div>
    </button>
  );
};

export const ButtonLink: FC<ButtonProps & { active?: boolean }> = ({
  children,
  size = "default",
  loading = false,
  className,
  active = false,
  ...restProps
}) => {
  return (
    <button
      disabled={loading}
      className={
        (className ?? "") +
        sharedClass +
        " bg-gradient-dark bg-gradient-dark bg-clip-text text-transparent hover:font-semibold dark:bg-gradient-light " +
        (size === "default" ? "text-base" : "text-sm")
      }
      {...restProps}
    >
      {children}
      <MdKeyboardArrowDown
        className={
          (active ? "rotate-180" : "") +
          " svg-gradient-fill ml-[-2px] h-5 w-5 flex-none"
        }
      />
    </button>
  );
};
