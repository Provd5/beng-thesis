import { type DetailedHTMLProps, type FC, type HTMLAttributes } from "react";

interface ModalWrapperProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: React.ReactNode;
  handler: () => void;
}

export const ModalWrapper: FC<ModalWrapperProps> = ({ children, handler }) => {
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={handler} />
      <div className="drop-shadow-modal absolute right-0 top-full z-20 mt-2 flex rounded-lg bg-white-light px-7 py-5 text-black-light dark:bg-black-light dark:text-white">
        {children}
      </div>
    </>
  );
};
