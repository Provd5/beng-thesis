import {
  type DetailedHTMLProps,
  type FC,
  type HTMLAttributes,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";

interface ModalWrapperProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: React.ReactNode;
  openModalButtonRef: RefObject<HTMLButtonElement>;
  closeModalHandler: () => void;
  size?: ModalSizes;
}

export const ModalWrapper: FC<ModalWrapperProps> = ({
  children,
  openModalButtonRef,
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

  // Changing the position of the modal when it's too close to the edge
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
        className={clsx(
          "absolute z-20 my-1 flex cursor-default bg-white-light text-black-light drop-shadow-modal transition-opacity dark:bg-black-light dark:text-white",
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
