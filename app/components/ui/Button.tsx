import type { ButtonHTMLAttributes, FC } from "react";
import { TbLoader3 } from "react-icons/tb";

type variants = "default" | "ghost" | "link" | "outline";

type sizes = "default" | "sm" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: variants;
  size?: sizes;
  square?: boolean;
  loading?: boolean;
  uppercase?: boolean;
  restClassNames?: string;
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "default",
  square = false,
  loading = false,
  uppercase = true,
  restClassNames,
  ...restProps
}) => {
  const mainStyle =
    "flex items-center justify-center rounded-md" +
    (uppercase ? " uppercase" : "");

  const variants = {
    default: "bg-red-500 hover:bg-blue-500 text-white",
    ghost: "bg-red-500/50 hover:bg-blue-500/50 text-black",
    link: "underline hover:font-bold",
    outline: "border border-red-500 hover:border-blue-500 text-white",
  };

  const sizes = {
    default: !square ? "py-2 px-4" : "w-8 h-8",
    sm: !square ? "py-1 px-2" : "w-6 h-6",
    lg: !square ? "py-3 px-6" : "w-10 h-10",
  };

  const className = mainStyle + " " + variants[variant] + " " + sizes[size];

  return (
    <button
      disabled={loading}
      className={`${restClassNames ?? ""} ${className}`}
      {...restProps}
    >
      {loading && (
        <span className="mx-2 animate-spin">
          <TbLoader3 />
        </span>
      )}
      {square && loading ? null : children}
    </button>
  );
};
