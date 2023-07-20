import type { DetailedHTMLProps, FC, InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  id: string;
  loading: boolean;
  label?: string;
}

export const Input: FC<InputProps> = ({
  id,
  loading,
  label,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="ml-3" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        disabled={loading}
        className={clsx(
          "w-64 rounded-lg bg-white px-3 py-2 text-md text-black dark:bg-black dark:text-white",
          className
        )}
        id={id}
        {...props}
      />
    </div>
  );
};
