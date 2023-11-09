import { forwardRef, type HTMLProps, type Ref } from "react";
import clsx from "clsx";

interface InputProps extends HTMLProps<HTMLInputElement | HTMLTextAreaElement> {
  id: string;
  loading: boolean;
  isTextarea?: boolean;
  inverted?: boolean;
  label?: string;
}

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(function InputComponent(
  { id, loading, isTextarea, inverted, label, className, ...props },
  ref
) {
  const commonProps = {
    disabled: loading,
    id: id,
    ...props,
  };

  const commonClass = inverted
    ? "dark:bg-white dark:text-black bg-black text-white"
    : "bg-white-light text-black dark:bg-black-dark dark:text-white";

  return (
    <div className="flex w-[inherit] flex-col">
      {label && (
        <label className="ml-3" htmlFor={id}>
          {label}
        </label>
      )}
      {isTextarea ? (
        <textarea
          {...commonProps}
          className={clsx(
            "rounded-l-md rounded-tr-md p-3 text-sm",
            commonClass,
            className
          )}
          ref={ref as Ref<HTMLTextAreaElement>}
        />
      ) : (
        <input
          {...commonProps}
          className={clsx(
            "rounded-lg px-3 py-2 text-md",
            commonClass,
            className
          )}
          ref={ref as Ref<HTMLInputElement>}
        />
      )}
    </div>
  );
});
