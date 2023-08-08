"use client";

import { type FC, useState } from "react";
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
import { ButtonLink } from "../ui/Buttons";
import { getBookmarkIcon } from "../ui/getBookmarkIcon";

interface ManageBookshelfProps {
  bookId: string;
  bookshelf?: bookshelfType | null;
  updatedAt?: Date | null;
}

export const ManageBookshelf: FC<ManageBookshelfProps> = ({
  bookId,
  bookshelf,
  updatedAt,
}) => {
  const t = useTranslations("Book.ManageBookshelf");
  const tb = useTranslations("Book.BookselfTypes");
  const te = useTranslations("Errors");

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBookshelf, setCurrentBookshelf] = useState(bookshelf);
  const [updatedAtState, setUpdatedAtState] = useState(
    updatedAt && dateFormater(updatedAt)
  );

  const bookshelfArray: bookshelfType[] = [
    "ALREADY_READ",
    "TO_READ",
    "ABANDONED",
    "READING",
    "OTHER",
  ];

  const handleChangeBookshelf = async (bookshelf: bookshelfType | null) => {
    setIsModalOpen(false);
    if (bookshelf === currentBookshelf) return;

    setIsLoading(true);
    const loadingToast = toast.loading(te(GlobalErrors.PENDING));

    const prevBookshelf = bookshelf;
    const prevDate = updatedAt && dateFormater(updatedAt);

    setCurrentBookshelf(bookshelf);
    setUpdatedAtState(dateFormater(new Date()));

    const formData = { bookId: bookId, bookshelf: bookshelf };

    try {
      ChangeBookshelfValidator.parse({ formData: formData });
      const { data }: { data: string } = await axios.post(
        `/api/book/manage/bookshelf/`,
        { formData: formData }
      );

      if (data !== GlobalErrors.SUCCESS) {
        toast.error(te(data));
        setCurrentBookshelf(prevBookshelf);
        setUpdatedAtState(prevDate);
        return;
      }

      // on success
      router.refresh();
    } catch (error) {
      toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
      setCurrentBookshelf(prevBookshelf);
      setUpdatedAtState(prevDate);
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-1">
      <div
        className="flex cursor-pointer"
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        {currentBookshelf ? (
          getBookmarkIcon(currentBookshelf, "lg")
        ) : (
          <BookmarksWrapper Icon={BsBookmarkPlus} color="gradient" size="lg" />
        )}
      </div>

      <div className="relative flex flex-auto flex-col">
        <ButtonLink
          className="self-start"
          active={isModalOpen}
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          {t("on a shelf")}
        </ButtonLink>
        {isModalOpen && (
          <ModalWrapper closeModalHandler={() => setIsModalOpen(false)}>
            <div className="flex grow flex-col gap-2">
              {bookshelfArray.map((bookshelf) => (
                <button
                  disabled={isLoading}
                  key={bookshelf}
                  className="flex items-center gap-1 py-1"
                  onClick={() => handleChangeBookshelf(bookshelf)}
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
                disabled={isLoading}
                className="flex items-center py-1"
                onClick={() => handleChangeBookshelf(null)}
              >
                <span className="whitespace-nowrap text-base">
                  {t("remove from shelf")}
                </span>
              </button>
            </div>
          </ModalWrapper>
        )}
        <p>{currentBookshelf ? tb(currentBookshelf) : "–"}</p>

        {updatedAtState && (
          <p className="text-xs text-black-light dark:text-white-dark">
            {updatedAtState}
          </p>
        )}
      </div>
    </div>
  );
};
