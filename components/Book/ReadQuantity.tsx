"use client";

import { type FC, useState } from "react";
import { type FieldValues, type UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";

interface ReadQuantitySetterProps {
  register: UseFormRegister<FieldValues>;
  initialQuantity: number;
}

export const ReadQuantitySetter: FC<ReadQuantitySetterProps> = ({
  register,
  initialQuantity,
}) => {
  const t = useTranslations("Book.ManageBookshelf");
  const [quantity, setQuantity] = useState(initialQuantity);

  return (
    <div className="flex flex-col">
      <label
        htmlFor="read-quantity-number-input"
        className="mb-0.5 whitespace-nowrap text-sm"
      >
        {t("read times:")}
      </label>
      <div className="flex h-9">
        <button
          className="h-full w-10 rounded-l-sm bg-white text-lg font-semibold dark:bg-black-dark"
          type="button"
          onClick={() => setQuantity((prev) => (prev <= 1 ? 1 : prev - 1))}
        >
          –
        </button>
        <input
          {...register("readQuantity")}
          disabled
          min={0}
          type="number"
          className="w-10 appearance-none bg-white-light px-1 py-2 text-center text-md text-black-dark dark:bg-black dark:text-white"
          name="read-quantity-number-input"
          id="read-quantity-number-input"
          value={quantity}
        />
        <button
          className="h-full w-10 rounded-r-sm bg-white text-lg font-semibold dark:bg-black-dark"
          type="button"
          onClick={() => setQuantity((prev) => prev + 1)}
        >
          ＋
        </button>
      </div>
    </div>
  );
};
