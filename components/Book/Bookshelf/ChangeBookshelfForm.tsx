"use client";

import { type FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";

import { type ChangeBookshelfInterface } from "~/types/data/bookshelf";

import { Button } from "~/components/ui/Buttons";
import { BookmarkIcon } from "~/components/ui/Icons/BookmarkIcon";
import { BookshelfService } from "~/lib/services/bookshelf";
import { ChangeBookshelfValidator } from "~/lib/validations/bookshelf";
import { dateFormater } from "~/utils/dateFormater";

import { ReadQuantitySetter } from "../ReadQuantity";
import { BookshelfModal } from "./BookshelfModal";

interface ChangeBookshelfFormProps {
  setOptimisticBookshlefState: (action: ChangeBookshelfInterface) => void;
  bookshelfData: ChangeBookshelfInterface;
}

export const ChangeBookshelfForm: FC<ChangeBookshelfFormProps> = ({
  setOptimisticBookshlefState,
  bookshelfData,
}) => {
  const t = useTranslations("Book.ManageBookshelf");
  const tb = useTranslations("Book.BookshelfTypes");

  const [isFormOpen, setIsFormOpen] = useState(!bookshelfData);

  const bookshelfService = new BookshelfService();

  const {
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(ChangeBookshelfValidator),
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const validData = ChangeBookshelfValidator.parse({
        formData,
      });
      setOptimisticBookshlefState(validData);

      await bookshelfService.changeBookshelf(validData.bookId, formData);
    } catch (error) {
      toast.error(error as string);
    }
  });

  if (!isFormOpen)
    return (
      <BookshelfModal
        setValue={setValue}
        currentBookshelf={
          bookshelfData?.bookshelf ? bookshelfData.bookshelf : null
        }
      />
    );

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <input
        {...register("bookshelf")}
        id="bookshelf-input"
        name="bookshelf-input"
        type="hidden"
        className="hidden"
      />
      <div className="mb-2 flex flex-col items-center">
        {bookshelfData?.bookshelf ? (
          <div className="flex flex-col items-center gap-2">
            <h1 className="flex gap-1">
              <BookmarkIcon category={bookshelfData.bookshelf} size="sm" />
              <span>{tb(bookshelfData.bookshelf)}</span>
            </h1>
            {bookshelfData?.bookshelf === "ALREADY_READ" && (
              <ReadQuantitySetter
                initialQuantity={bookshelfData.readQuantity || 0}
                register={register}
              />
            )}
          </div>
        ) : (
          <h1 className="min-w-[150px]">{t("are you sure?")}</h1>
        )}
      </div>
      {bookshelfData?.bookshelf && (
        <>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="began-reading-at-date-input"
              className="whitespace-nowrap"
            >
              {t("began reading:")}
            </label>
            <input
              {...register("beganReadingAt")}
              id="began-reading-at-date-input"
              name="began-reading-at-date-input"
              type="date"
              max={
                bookshelfData.updatedAt
                  ? dateFormater(bookshelfData.updatedAt)
                  : new Date().toISOString().split("T")[0]
              }
              defaultValue={
                bookshelfData.beganReadingAt
                  ? dateFormater(bookshelfData.beganReadingAt)
                  : ""
              }
              className="cursor-pointer py-0.5 text-md text-black-dark dark:text-white-light"
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
              {...register("updatedAt")}
              id="updated-at-date-input"
              name="updated-at-date-input"
              type="date"
              max={new Date().toISOString().split("T")[0]}
              defaultValue={
                bookshelfData.updatedAt
                  ? dateFormater(bookshelfData.updatedAt)
                  : dateFormater(new Date())
              }
              className="cursor-pointer py-0.5 text-md text-black-dark dark:text-white-light"
              required
            />
          </div>
        </>
      )}
      <div className="mt-3 flex justify-between">
        <button
          type="reset"
          className="self-center py-2 underline"
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
