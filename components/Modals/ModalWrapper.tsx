import {
  type DetailedHTMLProps,
  type Dispatch,
  type FC,
  type HTMLAttributes,
  type SetStateAction,
} from "react";

interface ModalWrapperProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: React.ReactNode;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export const ModalWrapper: FC<ModalWrapperProps> = ({
  children,
  setOpenModal,
}) => {
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={() => setOpenModal(false)} />
      <div className="absolute right-0 top-full z-20 mt-2 flex rounded-lg bg-white-light px-7 py-5 text-black-light drop-shadow-lg dark:bg-black-light dark:text-white">
        {children}
      </div>
    </>
  );
};
