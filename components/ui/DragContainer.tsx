"use client";

import { type FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

interface DragContainerProps {
  children: React.ReactNode;
}

export const DragContainer: FC<DragContainerProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [renderLeftButton, setRenderLeftButton] = useState(false);
  const [renderRightButton, setRenderRightButton] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const handleScroll = () => {
      if (container) {
        const { scrollLeft, offsetWidth, scrollWidth } = container;
        setRenderLeftButton(scrollLeft > 0);
        setRenderRightButton(scrollLeft + offsetWidth < scrollWidth);
      }
    };

    container?.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClickToScroll = (offset: number) => {
    containerRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

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
      <button
        className={clsx(
          "left-[-7px]",
          buttonClass,
          renderLeftButton ? "opacity-100" : "opacity-0"
        )}
        onClick={() => handleClickToScroll(-128)}
      >
        <MdNavigateBefore className="h-full w-full" />
      </button>
      <button
        className={clsx(
          "right-[-7px]",
          buttonClass,
          renderRightButton ? "opacity-100" : "opacity-0"
        )}
        onClick={() => handleClickToScroll(128)}
      >
        <MdNavigateNext className="h-full w-full" />
      </button>
    </div>
  );
};
