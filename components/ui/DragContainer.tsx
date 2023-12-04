"use client";

import { type FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

interface DragContainerProps {
  children: React.ReactNode;
  arrowSize?: "sm" | "default";
  containerClassName?: string;
  arrowsClassName?: string;
}

export const DragContainer: FC<DragContainerProps> = ({
  children,
  arrowSize = "default",
  containerClassName,
  arrowsClassName,
}) => {
  const arrowSizeClass = {
    default: "h-10 w-10",
    sm: "h-8 w-8",
  };

  const arrowsCommonClass =
    "hidden md:block rounded-full drop-shadow-icon text-white-light transition-opacity bg-secondary dark:bg-secondary-light";

  const containerRef = useRef<HTMLDivElement>(null);

  const [renderLeftButton, setRenderLeftButton] = useState(false);
  const [renderRightButton, setRenderRightButton] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, offsetWidth, scrollWidth } = container;
      setRenderLeftButton(scrollLeft > 0);
      setRenderRightButton(scrollLeft + offsetWidth < scrollWidth);
    };
    handleScroll();

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClickToScroll = (offset: number) => {
    containerRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  const isScrollable =
    containerRef.current && containerRef.current?.scrollWidth > 0;

  return (
    <div className="relative flex">
      <div
        ref={containerRef}
        className={clsx(
          "flex w-fit max-w-full overflow-x-auto overflow-y-hidden",
          containerClassName
        )}
      >
        {children}
      </div>
      {isScrollable && (
        <>
          <div className="pointer-events-none absolute bottom-0 left-[-20px] top-0 flex items-center">
            <button
              tabIndex={renderLeftButton ? 0 : -1}
              className={clsx(
                arrowSizeClass[arrowSize],
                arrowsCommonClass,
                renderLeftButton
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0",
                arrowsClassName
              )}
              onClick={() => handleClickToScroll(-256)}
            >
              <MdNavigateBefore className="h-full w-full" />
            </button>
          </div>
          <div className="pointer-events-none absolute bottom-0 right-[-20px] top-0 flex items-center">
            <button
              tabIndex={renderRightButton ? 0 : -1}
              className={clsx(
                arrowSizeClass[arrowSize],
                arrowsCommonClass,
                renderRightButton
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0",
                arrowsClassName
              )}
              onClick={() => handleClickToScroll(256)}
            >
              <MdNavigateNext className="h-full w-full" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
