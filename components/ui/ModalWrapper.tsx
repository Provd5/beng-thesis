import { type DetailedHTMLProps, type FC, type HTMLAttributes } from "react";

interface ModalWrapperProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: React.ReactNode;
}

export const ModalWrapper: FC<ModalWrapperProps> = ({ children }) => {
  return (
    <>
      <div className="absolute right-0 top-full mt-2 rounded-lg bg-white-light px-7 py-5 text-black-light drop-shadow-lg dark:bg-black-light dark:text-white">
        {children}
      </div>
    </>
  );
};
