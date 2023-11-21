"use client";

import { type FC, type FormEvent, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";
import { type bookshelfType } from "@prisma/client";
import axios from "axios";

import { BsBookmarkPlus } from "react-icons/bs";

import { ChangeBookshelfValidator } from "~/lib/validations/book/changeBookshelf";
import { GlobalErrors } from "~/lib/validations/errorsEnums";
import { dateFormater } from "~/utils/dateFormater";

import { ModalWrapper } from "../../Modals/ModalWrapper";
import { BookmarksWrapper } from "../../ui/BookmarksWrapper";
import { Button, ButtonLink } from "../../ui/Buttons";
import { getBookmarkIcon } from "../../ui/getBookmarkIcon";
import { ReadQuantity } from "../ReadQuantity";
import { ManageBookshelfModalContent } from "./ManageBookshelfModalContent";

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
  const tb = useTranslations("Book.BookshelfTypes");
  const te = useTranslations("Errors");

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

  const handleChangeBookshelfState = (bookshelf: bookshelfType | null) => {
    setSelectedBookshelf(bookshelf);
    setIsSelectDate(true);
  };

  const handleSubmitChangeBookshelf = async (
    thisBookshelf: bookshelfType | null,
    event?: FormEvent<HTMLFormElement>
  ) => {
    event && event.preventDefault();
    setIsModalOpen(false);
    setIsSelectDate(false);

    const form = event && (event.currentTarget as HTMLFormElement);
    const beganReadingAtElement = form?.elements.namedItem(
      "began-reading-at-date-input"
    ) as HTMLInputElement | undefined;
    const updatedAtElement = form?.elements.namedItem(
      "updated-at-date-input"
    ) as HTMLInputElement | undefined;
    const readQuantityElement = form?.elements.namedItem(
      "read-quantity-number-input"
    ) as HTMLInputElement | undefined;

    const loadingToast = toast.loading(te(GlobalErrors.PENDING));

    const prevBookshelf = currentBookshelf;
    const prevBeganReadingAt = beganReadingAtState;
    const prevUpdatedAt = updatedAtState;

    setCurrentBookshelf(thisBookshelf);
    updatedAtElement && setUpdatedAtState(updatedAtElement.valueAsDate);
    beganReadingAtElement &&
      setBeganReadingAtState(beganReadingAtElement.valueAsDate);

    const formData = {
      bookId: bookId,
      bookshelf: thisBookshelf,
      beganReadingAt: beganReadingAtElement?.valueAsDate?.toISOString() || null,
      updatedAt: updatedAtElement?.valueAsDate?.toISOString() || null,
      readQuantity:
        thisBookshelf === "ALREADY_READ" && readQuantityElement
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

      // success
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
    <div
      className="flex w-fit cursor-pointer gap-1"
      onClick={(e) =>
        !openModalButtonRef.current?.contains(e?.target as Node) &&
        setIsModalOpen(true)
      }
    >
      <div className="relative flex h-fit">
        {currentBookshelf ? (
          getBookmarkIcon(currentBookshelf, "lg")
        ) : (
          <BookmarksWrapper Icon={BsBookmarkPlus} color="gradient" size="lg" />
        )}
        {currentBookshelf === "ALREADY_READ" && readQuantityState > 1 && (
          <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red text-xs">
            <p className="text-white-light">×{readQuantityState}</p>
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
              <ManageBookshelfModalContent
                currentBookshelf={currentBookshelf}
                handleChangeBookshelfState={handleChangeBookshelfState}
                label={t("remove from shelf")}
              />
            ) : (
              <form
                className="flex flex-col gap-2"
                onSubmit={(e) =>
                  handleSubmitChangeBookshelf(selectedBookshelf, e)
                }
              >
                <div className="mb-2 flex flex-col items-center">
                  {selectedBookshelf ? (
                    <div className="flex flex-col items-center gap-2">
                      <h1 className="flex gap-1">
                        {getBookmarkIcon(selectedBookshelf, "sm")}
                        <span>{tb(selectedBookshelf)}</span>
                      </h1>
                      {selectedBookshelf === "ALREADY_READ" && (
                        <ReadQuantity
                          label={t("read times:")}
                          setReadQuantityState={setReadQuantityState}
                          readQuantityState={readQuantityState}
                        />
                      )}
                    </div>
                  ) : (
                    <h1 className="min-w-[150px]">{t("are you sure?")}</h1>
                  )}
                </div>
                {selectedBookshelf && (
                  <>
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
                        max={
                          updatedAtState
                            ? dateFormater(updatedAtState)
                            : new Date().toISOString().split("T")[0]
                        }
                        defaultValue={
                          beganReadingAtState
                            ? dateFormater(beganReadingAtState)
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
                        id="updated-at-date-input"
                        name="updated-at-date-input"
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        onChange={(e) =>
                          setUpdatedAtState(e.target.valueAsDate)
                        }
                        defaultValue={
                          currentBookshelf === selectedBookshelf &&
                          updatedAtState
                            ? dateFormater(updatedAtState)
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

        {currentBookshelf && updatedAtState && (
          <p className="text-xs text-black-light dark:text-white-dark">
            {dateFormater(updatedAtState)}
          </p>
        )}
      </div>
    </div>
  );
};
