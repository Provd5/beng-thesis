"use client";

import { type FC, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  type Formats,
  type TranslationValues,
  useTranslations,
} from "next-intl";

import { type OwnedBookTypes } from "~/types/consts";
import { type BookOwnedAsInterface } from "~/types/data/book";

import { ModalWrapper } from "~/components/Modals/ModalWrapper";
import { ButtonLink } from "~/components/ui/Buttons";
import { OwnedBookIcon } from "~/components/ui/Icons/OwnedBookIcon";
import { postOwnedAs } from "~/lib/services/book/actions";
import { dateFormater } from "~/utils/dateFormater";
import { translatableError } from "~/utils/translatableError";

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
  const te = useTranslations("Errors") as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined,
  ) => string;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModalButtonRef = useRef<HTMLButtonElement>(null);

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

  const [ownedBookState, setOwnedBookState] = useState(formatedData);

  const handleAddOwnedAs = async (ownedAs: OwnedBookTypes) => {
    try {
      setOwnedBookState({
        book:
          ownedAs === "BOOK"
            ? !ownedBookState.book
              ? dateFormater(new Date())
              : null
            : ownedBookState.book,
        ebook:
          ownedAs === "EBOOK"
            ? !ownedBookState.ebook
              ? dateFormater(new Date())
              : null
            : ownedBookState.ebook,
        audiobook:
          ownedAs === "AUDIOBOOK"
            ? !ownedBookState.audiobook
              ? dateFormater(new Date())
              : null
            : ownedBookState.audiobook,
      });

      const res = await postOwnedAs(bookId, ownedAs);
      if (!res.success) throw new Error(res.error);
    } catch (e) {
      setOwnedBookState(ownedBookState);
      toast.error(te(translatableError(e)));
    }
  };

  return (
    <div
      className="relative flex h-fit min-h-[60px] w-[132px] cursor-pointer rounded-md bg-white/90 p-1 transition-colors hover:bg-colors-gray/10 dark:bg-black/30 hover:dark:bg-white/10"
      onClick={(e) =>
        !openModalButtonRef.current?.contains(e?.target as Node) &&
        setIsModalOpen(true)
      }
    >
      <div className="flex flex-col">
        <ButtonLink
          ref={openModalButtonRef}
          aria-label="open-modal-button"
          active={isModalOpen}
          className="self-start"
          onClick={() => setIsModalOpen(!isModalOpen)}
          size="default"
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
                state={ownedBookState.book}
              />
              <OwnedAsModal
                handleAddFunc={() => handleAddOwnedAs("EBOOK")}
                ownedAs="EBOOK"
                state={ownedBookState.ebook}
              />
              <OwnedAsModal
                handleAddFunc={() => handleAddOwnedAs("AUDIOBOOK")}
                ownedAs="AUDIOBOOK"
                state={ownedBookState.audiobook}
              />
            </div>
          </ModalWrapper>
        )}
        <div className="flex gap-1 self-center">
          {ownedBookState.book && <OwnedBookIcon ownedAs="BOOK" size="sm" />}
          {ownedBookState.ebook && <OwnedBookIcon ownedAs="EBOOK" size="sm" />}
          {ownedBookState.audiobook && (
            <OwnedBookIcon ownedAs="AUDIOBOOK" size="sm" />
          )}
        </div>
      </div>
    </div>
  );
};
