"use client";

import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import axios from "axios";

import { type OwnedAsType } from "~/types/CategoryTypes";

import { getOwnedAsIcon } from "~/components/ui/getOwnedAsIcon";
import { OwnedAsValidator } from "~/lib/validations/book/ownedAs";
import { GlobalErrors } from "~/lib/validations/errorsEnums";
import { dateFormater } from "~/utils/dateFormater";

import { ModalWrapper } from "../../Modals/ModalWrapper";
import { ButtonLink } from "../../ui/Buttons";
import { ManageOwnedAsModalContent } from "./ManageOwnedAsModalContent";

interface ManageOwnedAsProps {
  bookId: string;
  addedEbookAt: Date | null | undefined;
  addedAudiobookAt: Date | null | undefined;
  addedBookAt: Date | null | undefined;
  size?: "sm" | "default" | "lg";
}

export const ManageOwnedAs: FC<ManageOwnedAsProps> = ({
  bookId,
  addedEbookAt,
  addedAudiobookAt,
  addedBookAt,
  size = "default",
}) => {
  const t = useTranslations("Book.ManageOwnedAs");
  const te = useTranslations("Errors");

  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [addedBookAtState, setAddedBookAtState] = useState(
    addedBookAt ? dateFormater(addedBookAt) : null
  );
  const [addedEbookAtState, setAddedEbookAtState] = useState(
    addedEbookAt ? dateFormater(addedEbookAt) : null
  );
  const [addedAudiobookAtState, setAddedAudiobookAtState] = useState(
    addedAudiobookAt ? dateFormater(addedAudiobookAt) : null
  );

  const openModalButtonRef = useRef<HTMLButtonElement>(null);

  const handleAddOwnedAs = async (
    ownedAs: OwnedAsType,
    addedState: string | null,
    addedSetState: Dispatch<SetStateAction<string | null>>
  ) => {
    const loadingToast = toast.loading(te(GlobalErrors.PENDING));
    const prevState = addedState;
    addedState ? addedSetState(null) : addedSetState(dateFormater(new Date()));

    const formData = {
      bookId: bookId,
      ownedAs: ownedAs,
    };

    try {
      OwnedAsValidator.parse({ formData: formData });
      const { data }: { data: string } = await axios.post(
        `/api/book/manage/owned-as/`,
        { formData: formData }
      );

      if (data !== GlobalErrors.SUCCESS) {
        toast.error(te(data));
        addedSetState(prevState);
        return;
      }

      // on success
      router.refresh();
    } catch (error) {
      toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
      addedSetState(prevState);
    } finally {
      toast.dismiss(loadingToast);
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
        size={size}
      >
        {t("owned as")}
      </ButtonLink>
      {isModalOpen && (
        <ModalWrapper
          closeModalHandler={() => setIsModalOpen(false)}
          openModalButtonRef={openModalButtonRef}
        >
          <div className="flex flex-col gap-2">
            <ManageOwnedAsModalContent
              text={t("BOOK")}
              ownedAs={"BOOK"}
              addedState={addedBookAtState}
              onClickFunc={() =>
                handleAddOwnedAs("BOOK", addedBookAtState, setAddedBookAtState)
              }
            />
            <ManageOwnedAsModalContent
              text={t("EBOOK")}
              ownedAs={"EBOOK"}
              addedState={addedEbookAtState}
              onClickFunc={() =>
                handleAddOwnedAs(
                  "EBOOK",
                  addedEbookAtState,
                  setAddedEbookAtState
                )
              }
            />
            <ManageOwnedAsModalContent
              text={t("AUDIOBOOK")}
              ownedAs={"AUDIOBOOK"}
              addedState={addedAudiobookAtState}
              onClickFunc={() =>
                handleAddOwnedAs(
                  "AUDIOBOOK",
                  addedAudiobookAtState,
                  setAddedAudiobookAtState
                )
              }
            />
          </div>
        </ModalWrapper>
      )}
      <div className="flex gap-1">
        {addedBookAtState && getOwnedAsIcon("BOOK", size)}
        {addedEbookAtState && getOwnedAsIcon("EBOOK", size)}
        {addedAudiobookAtState && getOwnedAsIcon("AUDIOBOOK", size)}
        {!addedBookAtState && !addedEbookAtState && !addedAudiobookAtState && (
          <p className="h-8 w-8">–</p>
        )}
      </div>
    </div>
  );
};
