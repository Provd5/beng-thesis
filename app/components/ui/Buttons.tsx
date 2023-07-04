import type { ButtonHTMLAttributes, FC } from "react";

import { MdKeyboardArrowDown } from "react-icons/md";

import { Loader } from "./Loader";
import { SvgPainter, SvgPainterWithIcon } from "./SvgPainter";

type sizes = "default" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  size?: sizes;
  loading?: boolean;
  defaultColor?: boolean;
  className?: string;
}

const sharedClass =
  " flex items-center justify-center transition-transform font-semibold whitespace-nowrap";

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
      className={
        (className ?? "") +
        sharedClass +
        " gap-1 hover:scale-105 " +
        (defaultColor
          ? "bg-gradient-dark text-white-light hover:bg-gradient-light dark:bg-gradient-light dark:hover:bg-gradient-dark "
          : "") +
        (size === "default"
          ? "rounded-xl px-8 py-3.5 text-base"
          : "rounded-lg px-6 py-3 text-sm")
      }
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
          <SvgPainter className="h-[1em] w-[1em] animate-spin text-md">
            <Loader className="stroke-[url(#myGradientDark)]" />
          </SvgPainter>
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
      className={
        (className ?? "") +
        sharedClass +
        " bg-gradient-dark bg-gradient-dark bg-clip-text text-transparent hover:font-semibold dark:bg-gradient-light " +
        (size === "default" ? "text-base" : "text-sm")
      }
      {...restProps}
    >
      {children}
      <span className={active ? "rotate-180" : ""}>
        <SvgPainterWithIcon
          textSize={"text-xl"}
          Icon={MdKeyboardArrowDown}
          className="flex-none"
        />
      </span>
    </button>
  );
};
