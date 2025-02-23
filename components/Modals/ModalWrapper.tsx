import {
  type DetailedHTMLProps,
  type FC,
  type HTMLAttributes,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "~/utils/cn";

interface ModalWrapperProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: React.ReactNode;
  openModalButtonRef: RefObject<HTMLButtonElement | null>;
  closeModalHandler: () => void;
  size?: "default" | "sm" | "xs";
}

export const ModalWrapper: FC<ModalWrapperProps> = ({
  children,
  openModalButtonRef,
  closeModalHandler,
  size = "default",
}) => {
  const sizeClass = {
    default: "px-7 py-5 rounded-xl",
    sm: "px-4 py-3 rounded-lg",
    xs: "p-1 rounded-md",
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [topPosition, setTopPosition] = useState<
    "top-full" | "bottom-full" | null
  >(null);
  const [rightPosiotion, setRightPosiotion] = useState<
    "right-0" | "left-0" | null
  >(null);

  // Changing the position of the modal when it's too close to the edge
  useEffect(() => {
    const modal = containerRef?.current;
    if (!modal) return;

    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const modalHeight = modal.clientHeight;
    const modalWidth = modal.clientWidth;

    const distanceToBottom =
      windowHeight - modalHeight - modal.getBoundingClientRect().top;

    const distanceToLeft =
      windowWidth - modalWidth - modal.getBoundingClientRect().left;

    if (distanceToBottom < 100) {
      setTopPosition("bottom-full");
    } else {
      setTopPosition("top-full");
    }

    if (distanceToLeft < 0) {
      setRightPosiotion("right-0");
    } else {
      setRightPosiotion("left-0");
    }
  }, []);

  // Close modal when click outside
  useEffect(() => {
    const listener = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        closeModalHandler();
      }

      const el = containerRef?.current;
      const buttonEl = openModalButtonRef?.current;

      if (
        !el ||
        el.contains((event?.target as Node) || null) ||
        buttonEl?.contains((event?.target as Node) || null)
      ) {
        return;
      }

      closeModalHandler(); // Call handler if click is outside modal
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
      document.removeEventListener("keydown", listener);
    };
  }, [closeModalHandler, openModalButtonRef]);

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "absolute z-50 my-1 flex cursor-default border border-black/10 bg-white text-colors-text drop-shadow transition-opacity dark:border-white/10 dark:bg-black",
          sizeClass[size],
          topPosition,
          rightPosiotion,
          topPosition && rightPosiotion ? "opacity-100" : "opacity-0",
        )}
      >
        {children}
      </div>
    </>
  );
};
