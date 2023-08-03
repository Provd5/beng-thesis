"use client";

import { type FC, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { type bookshelfType } from "@prisma/client";
import axios from "axios";
import clsx from "clsx";

import {
  BsBookmarkPlus,
  BsFillBookmarkCheckFill,
  BsFillBookmarkDashFill,
  BsFillBookmarkFill,
  BsFillBookmarksFill,
  BsFillBookmarkXFill,
} from "react-icons/bs";

import { ChangeBookshelfValidator } from "~/lib/validations/book/changeBookshelf";
import { GlobalErrors } from "~/lib/validations/errorsEnums";
import { dateFormater } from "~/utils/dateFormater";

import { ModalWrapper } from "../Modals/ModalWrapper";
import { ButtonLink } from "../ui/Buttons";
import { BookmarksWrapper } from "./BookmarksWrapper";

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
  const getBookshelfIcon = (bookshelf: bookshelfType, size?: "sm") => {
    switch (bookshelf) {
      case "TO_READ":
        return (
          <BookmarksWrapper
            size={size}
            Icon={BsFillBookmarkDashFill}
            color="blue"
          />
        );
      case "ALREADY_READ":
        return (
          <BookmarksWrapper
            size={size}
            Icon={BsFillBookmarkCheckFill}
            color="green"
          />
        );
      case "ABANDONED":
        return (
          <BookmarksWrapper
            size={size}
            Icon={BsFillBookmarkXFill}
            color="red"
          />
        );
      case "READING":
        return (
          <BookmarksWrapper
            size={size}
            Icon={BsFillBookmarkFill}
            color="gray"
          />
        );
      case "OTHER":
      default:
        return (
          <BookmarksWrapper
            size={size}
            Icon={BsFillBookmarksFill}
            color="default"
          />
        );
    }
  };

  const handleChangeBookshelf = async (bookshelf: bookshelfType | null) => {
    setIsModalOpen(false);
    if (bookshelf === currentBookshelf) return;

    setIsLoading(true);
    const loadingToast = toast.loading(te(GlobalErrors.PENDING));

    const prevBookshelf = currentBookshelf;
    const prevDate = updatedAtState;

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
          getBookshelfIcon(currentBookshelf)
        ) : (
          <BookmarksWrapper Icon={BsBookmarkPlus} color="gradient" />
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
                  {getBookshelfIcon(bookshelf, "sm")}
                  <span
                    className={clsx(
                      "whitespace-nowrap text-base",
                      currentBookshelf === bookshelf &&
                        "bg-gradient-dark bg-clip-text text-transparent dark:bg-gradient-light"
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
