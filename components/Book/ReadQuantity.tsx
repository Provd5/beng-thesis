"use client";

import type { Dispatch, FC, SetStateAction } from "react";

interface ReadQuantityProps {
  label: string;
  setReadQuantityState: Dispatch<SetStateAction<number>>;
  readQuantityState: number;
}

export const ReadQuantity: FC<ReadQuantityProps> = ({
  label,
  setReadQuantityState,
  readQuantityState,
}) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor="read-quantity-number-input"
        className="mb-0.5 whitespace-nowrap text-sm"
      >
        {label}
      </label>
      <div className="flex h-9">
        <button
          className="h-full w-10 rounded-l-sm bg-white text-lg font-semibold dark:bg-black-dark"
          type="button"
          onClick={() =>
            setReadQuantityState((prev) =>
              readQuantityState <= 1 ? 1 : prev - 1
            )
          }
        >
          –
        </button>
        <input
          disabled
          min={0}
          type="number"
          className="w-10 appearance-none bg-white-light px-1 py-2 text-center text-md text-black-dark dark:bg-black dark:text-white"
          name="read-quantity-number-input"
          id="read-quantity-number-input"
          value={readQuantityState}
        />
        <button
          className="h-full w-10 rounded-r-sm bg-white text-lg font-semibold dark:bg-black-dark"
          type="button"
          onClick={() => setReadQuantityState((prev) => prev + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};
