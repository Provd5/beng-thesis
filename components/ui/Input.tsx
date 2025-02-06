import { forwardRef, type HTMLProps, type Ref } from "react";

import { cn } from "~/utils/cn";

interface InputProps extends HTMLProps<HTMLInputElement | HTMLTextAreaElement> {
  id: string;
  loading?: boolean;
  isTextarea?: boolean;
  label?: string;
}

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(function InputComponent(
  { id, loading, isTextarea, label, className, ...props },
  ref,
) {
  const commonProps = {
    disabled: loading,
    id: id,
    ...props,
  };

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
          className={cn(
            "rounded-l-md rounded-tr-md border border-colors-gray/30 p-3 text-base text-colors-text caret-colors-accent placeholder:text-base",
            className,
          )}
          ref={ref as Ref<HTMLTextAreaElement>}
        />
      ) : (
        <input
          {...commonProps}
          className={cn(
            "text-md rounded-lg border border-colors-gray/30 px-3 py-2 text-colors-text caret-colors-accent placeholder:text-base",
            className,
          )}
          ref={ref as Ref<HTMLInputElement>}
        />
      )}
    </div>
  );
});
