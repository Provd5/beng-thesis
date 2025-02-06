"use client";

import { type Dispatch, type FC, type SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  type Formats,
  type TranslationValues,
  useTranslations,
} from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { type bookshelfType } from "@prisma/client";

import { Button } from "~/components/ui/Buttons";
import { BookmarkIcon } from "~/components/ui/Icons/BookmarkIcon";
import { changeBookshelf } from "~/lib/services/bookshelf/actions";
import {
  ChangeBookshelfValidator,
  type ChangeBookshelfValidatorType,
} from "~/lib/validations/bookshelf";
import { dateFormater } from "~/utils/dateFormater";
import { translatableError } from "~/utils/translatableError";

import { BookshelfModal } from "./BookshelfModal";
import { ReadQuantitySetter } from "./ReadQuantitySetter";

interface ChangeBookshelfFormProps {
  bookId: string;
  bookshelfData: ChangeBookshelfValidatorType;
  setBookshelfState: Dispatch<SetStateAction<ChangeBookshelfValidatorType>>;
  closeModal: () => void;
}

export const ChangeBookshelfForm: FC<ChangeBookshelfFormProps> = ({
  bookId,
  bookshelfData,
  setBookshelfState,
  closeModal,
}) => {
  const t = useTranslations("Book.ManageBookshelf");
  const tb = useTranslations("Book.BookshelfTypes");
  const te = useTranslations("Errors") as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined,
  ) => string;

  const [isFormOpen, setIsFormOpen] = useState(!bookshelfData);
  const [newBookshelfData, setNewBookshelfData] =
    useState<ChangeBookshelfValidatorType>(bookshelfData);

  const {
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      bookshelf: newBookshelfData.bookshelf,
      began_reading_at: newBookshelfData.began_reading_at,
      updated_at: newBookshelfData.updated_at,
      read_quantity: newBookshelfData.read_quantity,
    },
    resolver: zodResolver(ChangeBookshelfValidator),
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const validData = ChangeBookshelfValidator.parse(formData);

      // Filter out properties with undefined values
      const filteredData = Object.fromEntries(
        Object.entries(validData).filter(([_, value]) => value !== undefined),
      );
      setBookshelfState({
        ...newBookshelfData,
        ...filteredData,
      });

      const res = await changeBookshelf(bookId, validData);
      if (!res.success) throw new Error(res.error);
      setIsFormOpen(false);
      closeModal();
    } catch (e) {
      setBookshelfState(bookshelfData);
      toast.error(te(translatableError(e)));
    }
  });

  const receiveBookshelf = (bookshelf: bookshelfType | null) => {
    // Set the data received from BookshelfModal
    setIsFormOpen(true);
    setValue("bookshelf", bookshelf);
    setNewBookshelfData({ ...newBookshelfData, bookshelf });
  };

  if (!isFormOpen)
    return (
      <BookshelfModal
        changedBookshelf={receiveBookshelf}
        initialBookshelf={bookshelfData.bookshelf}
      />
    );

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <input
        {...(register("bookshelf"),
        {
          type: "hidden",
        })}
        id="bookshelf-input"
        className="hidden"
      />
      <div className="mb-2 flex flex-col items-center">
        {newBookshelfData.bookshelf ? (
          <div className="flex flex-col items-center gap-2">
            <h1 className="flex gap-1">
              <BookmarkIcon category={newBookshelfData.bookshelf} size="sm" />
              <span>{tb(newBookshelfData.bookshelf)}</span>
            </h1>
            {newBookshelfData.bookshelf === "ALREADY_READ" && (
              <ReadQuantitySetter
                initialQuantity={newBookshelfData.read_quantity}
                register={register}
                setValue={setValue}
              />
            )}
          </div>
        ) : (
          <h1 className="min-w-[150px]">{t("are you sure?")}</h1>
        )}
      </div>
      {newBookshelfData.bookshelf && (
        <>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="began-reading-at-date-input"
              className="whitespace-nowrap"
            >
              {t("began reading:")}
            </label>
            <input
              {...(register("began_reading_at", { valueAsDate: true }),
              {
                type: "date",
                defaultValue: newBookshelfData.began_reading_at
                  ? dateFormater(newBookshelfData.began_reading_at)
                  : undefined,
                max: dateFormater(newBookshelfData.updated_at),
              })}
              id="began-reading-at-date-input"
              onChange={(e) => (
                setValue("began_reading_at", e.target.valueAsDate),
                setNewBookshelfData({
                  ...newBookshelfData,
                  began_reading_at: e.target.valueAsDate,
                })
              )}
              className="cursor-pointer rounded border border-colors-text/30 p-1 text-lg text-colors-text"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="updated-at-date-input"
              className="whitespace-nowrap"
            >
              {t("on this shelf since:")}
            </label>
            <input
              {...(register("updated_at", { valueAsDate: true }),
              {
                type: "date",
                defaultValue: dateFormater(newBookshelfData.updated_at),
                required: true,
                max: new Date().toISOString().split("T")[0],
              })}
              id="updated-at-date-input"
              onChange={(e) => (
                setValue("updated_at", e.target.valueAsDate || new Date()),
                setNewBookshelfData({
                  ...newBookshelfData,
                  updated_at: e.target.valueAsDate || new Date(),
                })
              )}
              className="cursor-pointer rounded border border-colors-text/30 p-1 text-lg text-colors-text"
            />
          </div>
        </>
      )}
      <div className="mt-3 flex justify-between">
        <button
          type="reset"
          className="self-center py-2 underline transition-transform hover:scale-105"
          onClick={() => {
            reset();
            setIsFormOpen(false);
          }}
          disabled={isSubmitting}
        >
          {t("back")}
        </button>
        <Button
          size="xs"
          type="submit"
          className="uppercase"
          loading={isSubmitting}
        >
          {t("ok")}
        </Button>
      </div>
    </form>
  );
};
