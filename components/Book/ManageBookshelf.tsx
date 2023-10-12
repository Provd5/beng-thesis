"use client";

import { type FC, type FormEvent, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { type bookshelfType } from "@prisma/client";
import axios from "axios";
import clsx from "clsx";

import { BsBookmarkPlus } from "react-icons/bs";

import { ChangeBookshelfValidator } from "~/lib/validations/book/changeBookshelf";
import { GlobalErrors } from "~/lib/validations/errorsEnums";
import { dateFormater } from "~/utils/dateFormater";

import { ModalWrapper } from "../Modals/ModalWrapper";
import { BookmarksWrapper } from "../ui/BookmarksWrapper";
import { Button, ButtonLink } from "../ui/Buttons";
import { getBookmarkIcon } from "../ui/getBookmarkIcon";

interface ManageBookshelfProps {
  bookId: string;
  bookshelf: bookshelfType | null | undefined;
  updatedAt: Date | null | undefined;
  beganReadingAt: Date | null | undefined;
  readQuantity: number | undefined;
}

export const ManageBookshelf: FC<ManageBookshelfProps> = ({
  bookId,
  bookshelf,
  updatedAt,
  beganReadingAt,
  readQuantity,
}) => {
  const t = useTranslations("Book.ManageBookshelf");
  const tb = useTranslations("Book.bookshelfTypes");
  const te = useTranslations("Errors");

  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectDate, setIsSelectDate] = useState(false);

  const [currentBookshelf, setCurrentBookshelf] = useState(bookshelf || null);
  const [selectedBookshelf, setSelectedBookshelf] = useState(bookshelf || null);

  const [beganReadingAtState, setBeganReadingAtState] = useState(
    beganReadingAt || null
  );
  const [updatedAtState, setUpdatedAtState] = useState(updatedAt || null);

  const [readQuantityState, setReadQuantityState] = useState(
    readQuantity && readQuantity > 1 ? readQuantity : 1
  );

  const openModalButtonRef = useRef<HTMLButtonElement>(null);

  const bookshelfArray: bookshelfType[] = [
    "ALREADY_READ",
    "TO_READ",
    "ABANDONED",
    "READING",
    "OTHER",
  ];

  const handleChangeBookshelfState = (bookshelf: bookshelfType | null) => {
    setSelectedBookshelf(bookshelf);
    setIsSelectDate(true);
  };

  const handleSubmitChangeBookshelf = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    setIsModalOpen(false);
    setIsSelectDate(false);

    const form = event.currentTarget as HTMLFormElement;
    const beganReadingAtElement = form.elements.namedItem(
      "began-reading-at-date-input"
    ) as HTMLInputElement;
    const updatedAtElement = form.elements.namedItem(
      "updated-at-date-input"
    ) as HTMLInputElement;
    const readQuantityElement = form.elements.namedItem(
      "read-quantity-number-input"
    ) as HTMLInputElement;

    const loadingToast = toast.loading(te(GlobalErrors.PENDING));

    const prevBookshelf = currentBookshelf;
    const prevBeganReadingAt = beganReadingAtState;
    const prevUpdatedAt = updatedAtState;

    setCurrentBookshelf(selectedBookshelf);
    setBeganReadingAtState(beganReadingAtElement.valueAsDate);
    setUpdatedAtState(updatedAtElement.valueAsDate);

    const formData = {
      bookId: bookId,
      bookshelf: selectedBookshelf,
      beganReadingAt: beganReadingAtElement.valueAsDate?.toISOString() || null,
      updatedAt: updatedAtElement.valueAsDate?.toISOString() || null,
      readQuantity:
        selectedBookshelf === "ALREADY_READ"
          ? readQuantityElement.valueAsNumber
          : null,
    };
    try {
      ChangeBookshelfValidator.parse({ formData: formData });
      const { data }: { data: string } = await axios.post(
        `/api/book/manage/bookshelf/`,
        { formData: formData }
      );

      if (data !== GlobalErrors.SUCCESS) {
        toast.error(te(data));
        setCurrentBookshelf(prevBookshelf);
        setBeganReadingAtState(prevBeganReadingAt);
        setUpdatedAtState(prevUpdatedAt);
        return;
      }

      // on success
      router.refresh();
    } catch (error) {
      toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
      setCurrentBookshelf(prevBookshelf);
      setBeganReadingAtState(prevBeganReadingAt);
      setUpdatedAtState(prevUpdatedAt);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="flex gap-1">
      <div
        className="relative flex cursor-pointer"
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        {currentBookshelf ? (
          getBookmarkIcon(currentBookshelf, "lg")
        ) : (
          <BookmarksWrapper Icon={BsBookmarkPlus} color="gradient" size="lg" />
        )}
        {currentBookshelf === "ALREADY_READ" &&
          readQuantity &&
          readQuantity > 1 && (
            <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red text-xs">
              <p className="text-white-light">×{readQuantity}</p>
            </div>
          )}
      </div>

      <div className="relative flex flex-auto flex-col">
        <ButtonLink
          ref={openModalButtonRef}
          aria-label="open-modal-button"
          className="self-start"
          active={isModalOpen}
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          {t("on a shelf")}
        </ButtonLink>
        {isModalOpen && (
          <ModalWrapper
            closeModalHandler={() => setIsModalOpen(false)}
            openModalButtonRef={openModalButtonRef}
          >
            {!isSelectDate ? (
              <div className="flex grow flex-col gap-2">
                {bookshelfArray.map((bookshelf) => (
                  <button
                    key={bookshelf}
                    className="flex items-center gap-1 py-1.5"
                    onClick={() => handleChangeBookshelfState(bookshelf)}
                  >
                    {getBookmarkIcon(bookshelf, "sm")}
                    <span
                      className={clsx(
                        "whitespace-nowrap text-base",
                        currentBookshelf === bookshelf &&
                          "font-semibold text-secondary dark:text-secondary-light"
                      )}
                    >
                      {tb(bookshelf)}
                    </span>
                  </button>
                ))}
                <button
                  className="flex items-center py-1"
                  onClick={() => handleChangeBookshelfState(null)}
                >
                  <span className="whitespace-nowrap text-base">
                    {t("remove from shelf")}
                  </span>
                </button>
              </div>
            ) : (
              <form
                className="flex flex-col gap-2"
                onSubmit={handleSubmitChangeBookshelf}
              >
                <div className="mb-2 flex flex-col items-center">
                  {selectedBookshelf ? (
                    <div className="flex flex-col items-center gap-2">
                      <h1 className="flex gap-1">
                        {getBookmarkIcon(selectedBookshelf, "sm")}
                        <span>{tb(selectedBookshelf)}</span>
                      </h1>
                      {selectedBookshelf === "ALREADY_READ" && (
                        <div className="flex flex-col">
                          <label
                            htmlFor="read-quantity-number-input"
                            className="mb-0.5 whitespace-nowrap text-sm"
                          >
                            {t("read times:")}
                          </label>
                          <div className="flex">
                            <button
                              className="h-full w-10 rounded-l bg-white-light text-lg font-semibold dark:bg-black-dark"
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
                              className="w-10 bg-white-light px-1 py-2 text-center text-md text-black-dark dark:bg-black dark:text-white"
                              name="read-quantity-number-input"
                              id="read-quantity-number-input"
                              value={readQuantityState}
                            />
                            <button
                              className="h-full w-10 rounded-r bg-white-light text-lg font-semibold dark:bg-black-dark"
                              type="button"
                              onClick={() =>
                                setReadQuantityState((prev) => prev + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <h1>{t("remove from shelf")}</h1>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="began-reading-at-date-input"
                    className="whitespace-nowrap"
                  >
                    {t("began reading:")}
                  </label>
                  <input
                    id="began-reading-at-date-input"
                    name="began-reading-at-date-input"
                    type="date"
                    defaultValue={
                      beganReadingAtState
                        ? dateFormater(beganReadingAtState)
                        : ""
                    }
                    className="py-0.5 text-md text-black-dark dark:text-white-light"
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
                    id="updated-at-date-input"
                    name="updated-at-date-input"
                    type="date"
                    defaultValue={
                      currentBookshelf === selectedBookshelf
                        ? dateFormater(updatedAtState || new Date())
                        : dateFormater(new Date())
                    }
                    className="py-0.5 text-md text-black-dark dark:text-white-light"
                    required
                  />
                </div>
                <div className="mt-3 flex justify-between">
                  <button
                    type="reset"
                    className="self-center py-2 underline"
                    onClick={() => setIsSelectDate(false)}
                  >
                    {t("back")}
                  </button>
                  <Button size="xs" type="submit" className="uppercase">
                    {t("ok")}
                  </Button>
                </div>
              </form>
            )}
          </ModalWrapper>
        )}
        <p>{currentBookshelf ? tb(currentBookshelf) : "–"}</p>

        {updatedAtState && (
          <p className="text-xs text-black-light dark:text-white-dark">
            {dateFormater(updatedAtState)}
          </p>
        )}
      </div>
    </div>
  );
};
