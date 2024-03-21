"use client";

import {
  experimental_useOptimistic as useOptimistic,
  type FC,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { type BookOwnedAsInterface } from "~/types/data/book";
import { type OwnedBookTypes } from "~/types/data/bookshelf";

import { ModalWrapper } from "~/components/Modals/ModalWrapper";
import { ButtonLink } from "~/components/ui/Buttons";
import { OwnedBookIcon } from "~/components/ui/Icons/OwnedBookIcon";
import { BookService } from "~/lib/services/book";
import { dateFormater } from "~/utils/dateFormater";

import { OwnedAsModal } from "./OwnedAsModal";

interface AddOwnedAsFormProps {
  bookId: string;
  ownedAsData: BookOwnedAsInterface | null;
}

export const AddOwnedAsForm: FC<AddOwnedAsFormProps> = ({
  bookId,
  ownedAsData,
}) => {
  const t = useTranslations("Book.ManageOwnedAs");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModalButtonRef = useRef<HTMLButtonElement>(null);

  const bookService = new BookService();

  const formatedData = {
    book: ownedAsData?.added_book_at
      ? dateFormater(ownedAsData.added_book_at)
      : null,
    ebook: ownedAsData?.added_ebook_at
      ? dateFormater(ownedAsData.added_ebook_at)
      : null,
    audiobook: ownedAsData?.added_audiobook_at
      ? dateFormater(ownedAsData.added_audiobook_at)
      : null,
  };

  const [optimisticOwnedBookState, setOptimisticOwnedBookState] = useOptimistic(
    formatedData,
    (
      _,
      newState: {
        book: string | null;
        ebook: string | null;
        audiobook: string | null;
      }
    ) => {
      return newState;
    }
  );

  const handleAddOwnedAs = async (ownedAs: OwnedBookTypes) => {
    try {
      setOptimisticOwnedBookState({
        book:
          ownedAs === "BOOK"
            ? dateFormater(new Date())
            : optimisticOwnedBookState.book,
        ebook:
          ownedAs === "EBOOK"
            ? dateFormater(new Date())
            : optimisticOwnedBookState.ebook,
        audiobook:
          ownedAs === "AUDIOBOOK"
            ? dateFormater(new Date())
            : optimisticOwnedBookState.audiobook,
      });

      await bookService.postOwnedAs(bookId, ownedAs);
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <div
      className="relative flex w-fit cursor-pointer flex-col"
      onClick={(e) =>
        !openModalButtonRef.current?.contains(e?.target as Node) &&
        setIsModalOpen(true)
      }
    >
      <ButtonLink
        ref={openModalButtonRef}
        aria-label="open-modal-button"
        active={isModalOpen}
        className="self-start"
        onClick={() => setIsModalOpen(!isModalOpen)}
        size="sm"
      >
        {t("owned as")}
      </ButtonLink>
      {isModalOpen && (
        <ModalWrapper
          closeModalHandler={() => setIsModalOpen(false)}
          openModalButtonRef={openModalButtonRef}
        >
          <div className="flex flex-col gap-2">
            <OwnedAsModal
              handleAddFunc={() => handleAddOwnedAs("BOOK")}
              ownedAs="BOOK"
              state={optimisticOwnedBookState.book}
            />
            <OwnedAsModal
              handleAddFunc={() => handleAddOwnedAs("EBOOK")}
              ownedAs="EBOOK"
              state={optimisticOwnedBookState.ebook}
            />
            <OwnedAsModal
              handleAddFunc={() => handleAddOwnedAs("AUDIOBOOK")}
              ownedAs="AUDIOBOOK"
              state={optimisticOwnedBookState.audiobook}
            />
          </div>
        </ModalWrapper>
      )}
      <div className="flex gap-1">
        {optimisticOwnedBookState.book && (
          <OwnedBookIcon ownedAs="BOOK" size="sm" />
        )}
        {optimisticOwnedBookState.ebook && (
          <OwnedBookIcon ownedAs="EBOOK" size="sm" />
        )}
        {optimisticOwnedBookState.audiobook && (
          <OwnedBookIcon ownedAs="AUDIOBOOK" size="sm" />
        )}
        {!optimisticOwnedBookState.audiobook &&
          !optimisticOwnedBookState.book &&
          !optimisticOwnedBookState.ebook && <p className="h-8 w-8">–</p>}
      </div>
    </div>
  );
};
