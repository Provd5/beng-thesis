"use client";

import { type FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

interface DragContainerProps {
  children: React.ReactNode;
  itemsQuantity: number;
}

export const DragContainer: FC<DragContainerProps> = ({
  children,
  itemsQuantity,
}) => {
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

  const buttonClass =
    "absolute hidden md:block top-[70px] h-10 w-10 rounded-full bg-gray/90 drop-shadow-icon text-white-light transition-opacity";

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="custom-scrollbar flex snap-x scroll-px-3 gap-3 overflow-x-auto overflow-y-hidden px-3 pb-2 pt-0.5"
      >
        {children}
      </div>
      {isScrollable && (
        <>
          <button
            tabIndex={renderLeftButton ? 0 : -1}
            className={clsx(
              "left-[-7px]",
              buttonClass,
              renderLeftButton ? "opacity-100" : "pointer-events-none opacity-0"
            )}
            onClick={() => handleClickToScroll(-256)}
          >
            <MdNavigateBefore className="h-full w-full" />
          </button>
          <button
            tabIndex={renderRightButton ? 0 : -1}
            className={clsx(
              "right-[-7px]",
              buttonClass,
              renderRightButton
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            )}
            onClick={() => handleClickToScroll(256)}
          >
            <MdNavigateNext className="h-full w-full" />
          </button>
        </>
      )}
    </div>
  );
};
