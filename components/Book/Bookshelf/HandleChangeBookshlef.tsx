"use client";

import {
  experimental_useOptimistic as useOptimistic,
  type FC,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";

import { BsBookmarkPlus } from "react-icons/bs";

import {
  type BookshelfInterface,
  type ChangeBookshelfInterface,
} from "~/types/data/bookshelf";

import { ModalWrapper } from "~/components/Modals/ModalWrapper";
import { ButtonLink } from "~/components/ui/Buttons";
import { BookmarkIcon } from "~/components/ui/Icons/BookmarkIcon";
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
    bookId,
    bookshelf: bookshelfData?.bookshelf || null,
    beganReadingAt: bookshelfData?.began_reading_at || null,
    updatedAt: bookshelfData?.updated_at || null,
    readQuantity: bookshelfData?.read_quantity || null,
  };

  const [optimisticBookshlefState, setOptimisticBookshlefState] = useOptimistic(
    formatedData,
    (_, newState: ChangeBookshelfInterface) => {
      return newState;
    }
  );

  return (
    <div
      className="flex w-fit cursor-pointer gap-1"
      onClick={(e) =>
        !openModalButtonRef.current?.contains(e?.target as Node) &&
        setIsModalOpen(true)
      }
    >
      <div className="relative flex h-fit">
        {optimisticBookshlefState?.bookshelf ? (
          <BookmarkIcon
            category={optimisticBookshlefState.bookshelf}
            size="lg"
          />
        ) : (
          <BookmarkIcon Icon={BsBookmarkPlus} color="gradient" size="lg" />
        )}
        {optimisticBookshlefState?.bookshelf === "ALREADY_READ" &&
          optimisticBookshlefState.readQuantity &&
          optimisticBookshlefState.readQuantity > 1 && (
            <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red text-xs">
              <p className="text-white-light">
                ×{optimisticBookshlefState.readQuantity}
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
              bookshelfData={optimisticBookshlefState}
              setOptimisticBookshlefState={setOptimisticBookshlefState}
            />
          </ModalWrapper>
        )}
        <p>
          {optimisticBookshlefState?.bookshelf
            ? tb(optimisticBookshlefState.bookshelf)
            : "–"}
        </p>

        {optimisticBookshlefState?.bookshelf &&
          optimisticBookshlefState.updatedAt && (
            <p className="text-xs text-black-light dark:text-white-dark">
              {dateFormater(optimisticBookshlefState.updatedAt)}
            </p>
          )}
      </div>
    </div>
  );
};
