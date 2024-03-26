"use client";

import { type FC, useState } from "react";
import { type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import { useTranslations } from "next-intl";
import { type bookshelfType } from "@prisma/client";

interface ReadQuantitySetterProps {
  initialQuantity: number | undefined;
  register: UseFormRegister<{
    bookshelf: bookshelfType | null;
    began_reading_at: Date | null | undefined;
    updated_at: Date;
    read_quantity: number | undefined;
  }>;
  setValue: UseFormSetValue<{
    bookshelf: bookshelfType | null;
    began_reading_at: Date | null | undefined;
    updated_at: Date;
    read_quantity: number | undefined;
  }>;
}

export const ReadQuantitySetter: FC<ReadQuantitySetterProps> = ({
  initialQuantity,
  register,
  setValue,
}) => {
  const t = useTranslations("Book.ManageBookshelf");

  const validQuantity =
    !!initialQuantity && initialQuantity > 1 ? initialQuantity : 1;
  const [quantity, setQuantity] = useState(validQuantity);

  return (
    <div className="flex flex-col">
      <label
        htmlFor="read-quantity-input"
        className="mb-0.5 whitespace-nowrap text-sm"
      >
        {t("read times:")}
      </label>
      <div className="flex h-9">
        <button
          className="h-full w-10 rounded-l-sm bg-white text-lg font-semibold dark:bg-black-dark"
          type="button"
          onClick={() => (
            setValue("read_quantity", quantity <= 1 ? 1 : quantity - 1),
            setQuantity((prev) => (prev <= 1 ? 1 : prev - 1))
          )}
        >
          –
        </button>
        <input
          {...(register("read_quantity", { valueAsNumber: true }),
          { min: 1, value: quantity, disabled: true })}
          id="read-quantity-input"
          className="w-10 appearance-none bg-white-light px-1 py-2 text-center text-md text-black-dark dark:bg-black dark:text-white"
        />
        <button
          className="h-full w-10 rounded-r-sm bg-white text-lg font-semibold dark:bg-black-dark"
          type="button"
          onClick={() => (
            setValue("read_quantity", quantity + 1),
            setQuantity((prev) => prev + 1)
          )}
        >
          ＋
        </button>
      </div>
    </div>
  );
};
