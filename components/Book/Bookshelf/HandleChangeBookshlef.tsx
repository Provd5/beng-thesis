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

  const formattedData = {
    bookshelf: bookshelfData?.bookshelf || null,
    began_reading_at: bookshelfData?.began_reading_at,
    updated_at: bookshelfData?.updated_at || new Date(),
    read_quantity: bookshelfData?.read_quantity,
  };

  const [bookshelfState, setBookshelfState] =
    useState<ChangeBookshelfValidatorType>(formattedData);

  return (
    <div
      className="relative flex h-fit min-h-[70px] w-36 cursor-pointer gap-1 rounded-md bg-white/90 p-1 transition-colors hover:bg-colors-gray/10 dark:bg-black/30 hover:dark:bg-white/10"
      onClick={(e) =>
        !openModalButtonRef.current?.contains(e?.target as Node) &&
        setIsModalOpen(true)
      }
    >
      <div className="relative flex h-fit">
        {bookshelfState?.bookshelf ? (
          <BookmarkIcon category={bookshelfState.bookshelf} size="lg" />
        ) : (
          <BookmarkIcon Icon={BsBookmarkPlus} color="gradient" size="lg" />
        )}
        {bookshelfState?.bookshelf === "ALREADY_READ" &&
          !!bookshelfState.read_quantity &&
          bookshelfState.read_quantity > 1 && (
            <div className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-colors-red text-xs">
              <p className="text-white">×{bookshelfState.read_quantity}</p>
            </div>
          )}
      </div>

      <div className="flex flex-col">
        <ButtonLink
          ref={openModalButtonRef}
          aria-label="open-modal-button"
          className="self-start"
          active={isModalOpen}
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          {t("on a shelf")}
        </ButtonLink>
        <div className="mr-1 flex flex-col items-end">
          <p className="-mt-1 whitespace-nowrap text-sm">
            {bookshelfState?.bookshelf && tb(bookshelfState.bookshelf)}
          </p>

          {bookshelfState?.bookshelf && bookshelfState.updated_at && (
            <p className="whitespace-nowrap text-xs text-colors-text">
              {dateFormater(bookshelfState.updated_at)}
            </p>
          )}
        </div>
      </div>
      {isModalOpen && (
        <ModalWrapper
          closeModalHandler={() => setIsModalOpen(false)}
          openModalButtonRef={openModalButtonRef}
        >
          <ChangeBookshelfForm
            key={`ChangeBookshelfForm-${bookId}`}
            bookId={bookId}
            bookshelfData={bookshelfState}
            setBookshelfState={setBookshelfState}
            closeModal={() => setIsModalOpen(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
};
