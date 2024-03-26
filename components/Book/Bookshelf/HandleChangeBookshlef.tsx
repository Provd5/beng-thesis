"use client";

import { type FC, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { BsBookmarkPlus } from "react-icons/bs";

import { type BookshelfInterface } from "~/types/data/bookshelf";

import { ModalWrapper } from "~/components/Modals/ModalWrapper";
import { ButtonLink } from "~/components/ui/Buttons";
import { BookmarkIcon } from "~/components/ui/Icons/BookmarkIcon";
import { type ChangeBookshelfValidatorType } from "~/lib/validations/bookshelf";
import { dateFormater } from "~/utils/dateFormater";

import { ChangeBookshelfForm } from "./ChangeBookshelfForm";

interface HandleChangeBookshlefProps {
  bookId: string;
  bookshelfData: BookshelfInterface | null;
}

export const HandleChangeBookshlef: FC<HandleChangeBookshlefProps> = ({
  bookId,
  bookshelfData,
}) => {
  const t = useTranslations("Book.ManageBookshelf");
  const tb = useTranslations("Book.BookshelfTypes");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModalButtonRef = useRef<HTMLButtonElement>(null);

  const formatedData = {
    bookshelf: bookshelfData?.bookshelf || null,
    began_reading_at: bookshelfData?.began_reading_at,
    updated_at: bookshelfData?.updated_at || new Date(),
    read_quantity: bookshelfData?.read_quantity,
  };

  const [bookshlefState, setBookshlefState] =
    useState<ChangeBookshelfValidatorType>(formatedData);

  return (
    <div
      className="flex w-fit cursor-pointer gap-1"
      onClick={(e) =>
        !openModalButtonRef.current?.contains(e?.target as Node) &&
        setIsModalOpen(true)
      }
    >
      <div className="relative flex h-fit">
        {bookshlefState?.bookshelf ? (
          <BookmarkIcon category={bookshlefState.bookshelf} size="lg" />
        ) : (
          <BookmarkIcon Icon={BsBookmarkPlus} color="gradient" size="lg" />
        )}
        {bookshlefState?.bookshelf === "ALREADY_READ" &&
          !!bookshlefState.read_quantity &&
          bookshlefState.read_quantity > 1 && (
            <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red text-xs">
              <p className="text-white-light">
                ×{bookshlefState.read_quantity}
              </p>
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
            <ChangeBookshelfForm
              bookId={bookId}
              bookshelfData={bookshlefState}
              setBookshlefState={setBookshlefState}
              closeModal={() => setIsModalOpen(false)}
            />
          </ModalWrapper>
        )}
        <p>{bookshlefState?.bookshelf ? tb(bookshlefState.bookshelf) : "–"}</p>

        {bookshlefState?.bookshelf && bookshlefState.updated_at && (
          <p className="text-xs text-black-light dark:text-white-dark">
            {dateFormater(bookshlefState.updated_at)}
          </p>
        )}
      </div>
    </div>
  );
};
