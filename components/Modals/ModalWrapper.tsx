import {
  type DetailedHTMLProps,
  type FC,
  type HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";

import { type modalSizes } from "~/types/sizes";

interface ModalWrapperProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: React.ReactNode;
  closeModalHandler: () => void;
  size?: modalSizes;
}

export const ModalWrapper: FC<ModalWrapperProps> = ({
  children,
  closeModalHandler,
  size = "default",
}) => {
  const sizeClass = {
    default: "px-7 py-5 rounded-lg",
    sm: "px-4 py-3 rounded-md",
    xs: "p-1 rounded-sm",
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [topPosition, setTopPosition] = useState<
    "top-full" | "bottom-full" | null
  >(null);
  const [rightPosiotion, setRightPosiotion] = useState<
    "right-0" | "left-0" | null
  >(null);

  useEffect(() => {
    const modal = containerRef?.current;
    if (!modal) return;

    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const modalHeight = modal.clientHeight;
    const modalWidth = modal.clientWidth;

    const distanceToBottom =
      windowHeight - modal.getBoundingClientRect().bottom;

    const distanceToLeft = windowWidth - modal.getBoundingClientRect().left;

    if (modalHeight > distanceToBottom) {
      setTopPosition("bottom-full");
    } else {
      setTopPosition("top-full");
    }

    if (modalWidth > distanceToLeft) {
      setRightPosiotion("right-0");
    } else {
      setRightPosiotion("left-0");
    }
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 z-10 cursor-pointer"
        onClick={closeModalHandler}
      />
      <div
        ref={containerRef}
        className={clsx(
          "absolute z-20 mt-1 flex cursor-default bg-white-light text-black-light drop-shadow-modal transition-opacity dark:bg-black-light dark:text-white",
          sizeClass[size],
          topPosition,
          rightPosiotion,
          topPosition && rightPosiotion ? "opacity-100" : "opacity-0"
        )}
      >
        {children}
      </div>
    </>
  );
};
