"use client";

import { type Dispatch, type FC, type SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import axios from "axios";
import clsx from "clsx";

import { BsCheck } from "react-icons/bs";

import { ownedAsEnum, OwnedAsValidator } from "~/lib/validations/book/ownedAs";
import { GlobalErrors } from "~/lib/validations/errorsEnums";
import { dateFormater } from "~/utils/dateFormater";

import { ModalWrapper } from "../Modals/ModalWrapper";
import { ButtonLink } from "../ui/Buttons";
import { AsAudiobook, AsBook, AsEbook } from "./OwnedAsIcons";

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

  const renderOwnedAsIcon = (condition: boolean, IconComponent: React.FC) => {
    return condition ? (
      <div className="h-8 w-8">
        <IconComponent />
      </div>
    ) : null;
  };

  const renderModalContentButton = (
    ownedAs: ownedAsEnum,
    addedState: string | null,
    addedSetState: Dispatch<SetStateAction<string | null>>,
    IconComponent: React.FC
  ) => {
    return (
      <button
        disabled={isLoading}
        onClick={() => handleAddOwnedAs(ownedAs, addedState, addedSetState)}
        className="flex flex-auto justify-between gap-2 py-1"
      >
        <div className="flex items-center gap-1.5">
          <div className="h-7 w-7">
            <IconComponent />
          </div>
          <div className="flex h-8 flex-col items-start justify-center">
            <h1
              className={clsx(
                "text-base",
                addedState &&
                  "bg-gradient-dark bg-clip-text text-transparent dark:bg-gradient-light"
              )}
            >
              {t(ownedAs)}
            </h1>
            <p className="text-xs text-black-light dark:text-white-dark">
              {addedState}
            </p>
          </div>
        </div>
        <div className="h-6 w-6 self-center">
          {addedState && (
            <BsCheck className="h-full w-full fill-[var(--svg-gradient-dark)] dark:fill-[var(--svg-gradient)]" />
          )}
        </div>
      </button>
    );
  };

  const handleAddOwnedAs = async (
    ownedAs: ownedAsEnum,
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
        className="self-start"
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        {t("owned as")}
      </ButtonLink>
      {isModalOpen && (
        <ModalWrapper closeModalHandler={() => setIsModalOpen(false)}>
          <div className="flex flex-col gap-2">
            {renderModalContentButton(
              ownedAsEnum.BOOK,
              addedBookAtState,
              setAddedBookAtState,
              AsBook
            )}
            {renderModalContentButton(
              ownedAsEnum.EBOOK,
              addedEbookAtState,
              setAddedEbookAtState,
              AsEbook
            )}
            {renderModalContentButton(
              ownedAsEnum.AUDIOBOOK,
              addedAudiobookAtState,
              setAddedAudiobookAtState,
              AsAudiobook
            )}
          </div>
        </ModalWrapper>
      )}
      <div className="flex gap-1">
        {renderOwnedAsIcon(!!addedBookAtState, AsBook)}
        {renderOwnedAsIcon(!!addedEbookAtState, AsEbook)}
        {renderOwnedAsIcon(!!addedAudiobookAtState, AsAudiobook)}
        {!addedBookAtState && !addedEbookAtState && !addedAudiobookAtState && (
          <p className="h-8 w-8">–</p>
        )}
      </div>
    </div>
  );
};
