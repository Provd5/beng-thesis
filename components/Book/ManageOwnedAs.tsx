"use client";

import { type Dispatch, type FC, type SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import axios from "axios";

import { getOwnedAsIcon } from "~/components/ui/getOwnedAsIcon";
import {
  type ownedAsType,
  OwnedAsValidator,
} from "~/lib/validations/book/ownedAs";
import { GlobalErrors } from "~/lib/validations/errorsEnums";
import { dateFormater } from "~/utils/dateFormater";

import { ModalWrapper } from "../Modals/ModalWrapper";
import { ButtonLink } from "../ui/Buttons";
import { ManageOwnedAsModalContent } from "./ManageOwnedAsModalContent";

interface ManageOwnedAsProps {
  bookId: string;
  addedEbookAt?: Date | null;
  addedAudiobookAt?: Date | null;
  addedBookAt?: Date | null;
}

export const ManageOwnedAs: FC<ManageOwnedAsProps> = ({
  bookId,
  addedEbookAt,
  addedAudiobookAt,
  addedBookAt,
}) => {
  const t = useTranslations("Book.ManageOwnedAs");
  const te = useTranslations("Errors");

  const [isLoading, setIsLoading] = useState(false);
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

  const handleAddOwnedAs = async (
    ownedAs: ownedAsType,
    addedState: string | null,
    addedSetState: Dispatch<SetStateAction<string | null>>
  ) => {
    setIsLoading(true);
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
    } catch (error) {
      toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
      addedSetState(prevState);
    } finally {
      toast.dismiss(loadingToast);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="relative flex flex-col">
      <ButtonLink
        active={isModalOpen}
        className="self-start"
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        {t("owned as")}
      </ButtonLink>
      {isModalOpen && (
        <ModalWrapper closeModalHandler={() => setIsModalOpen(false)}>
          <div className="flex flex-col gap-2">
            <ManageOwnedAsModalContent
              text={t("BOOK")}
              ownedAs={"BOOK"}
              addedState={addedBookAtState}
              onClickFunc={() =>
                handleAddOwnedAs("BOOK", addedBookAtState, setAddedBookAtState)
              }
              isLoading={isLoading}
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
              isLoading={isLoading}
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
              isLoading={isLoading}
            />
          </div>
        </ModalWrapper>
      )}
      <div className="flex gap-1">
        {addedBookAtState && getOwnedAsIcon("BOOK", "lg")}
        {addedEbookAtState && getOwnedAsIcon("EBOOK", "lg")}
        {addedAudiobookAtState && getOwnedAsIcon("AUDIOBOOK", "lg")}
        {!addedBookAtState && !addedEbookAtState && !addedAudiobookAtState && (
          <p className="h-8 w-8">–</p>
        )}
      </div>
    </div>
  );
};
