"use client";

import { type FC, useEffect, useRef, useState } from "react";

import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

import { cn } from "~/utils/cn";

interface DragContainerProps {
  children: React.ReactNode;
  arrowSize?: "sm" | "default";
  containerClassName?: string;
  innerContainerClassName?: string;
  arrowsClassName?: string;
}

export const DragContainer: FC<DragContainerProps> = ({
  children,
  arrowSize = "default",
  containerClassName,
  innerContainerClassName,
  arrowsClassName,
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

  const arrowSizeClass = {
    default: "size-10",
    sm: "size-8",
  };

  const arrowsCommonClass =
    "hidden md:block rounded-full drop-shadow-icon text-white transition-all bg-colors-primary hover:scale-105 hover:bg-colors-accent";

  return (
    <div className={cn("relative flex", containerClassName)}>
      <div
        ref={containerRef}
        className={cn(
          "flex w-fit max-w-full overflow-x-auto overflow-y-hidden",
          innerContainerClassName,
        )}
      >
        {children}
      </div>
      {isScrollable && (
        <>
          <div className="pointer-events-none absolute bottom-0 left-[-20px] top-0 flex items-center">
            <button
              tabIndex={renderLeftButton ? 0 : -1}
              className={cn(
                arrowSizeClass[arrowSize],
                arrowsCommonClass,
                renderLeftButton
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0",
                arrowsClassName,
              )}
              onClick={() => handleClickToScroll(-256)}
            >
              <MdNavigateBefore className="size-full" />
            </button>
          </div>
          <div className="pointer-events-none absolute bottom-0 right-[-20px] top-0 flex items-center">
            <button
              tabIndex={renderRightButton ? 0 : -1}
              className={cn(
                arrowSizeClass[arrowSize],
                arrowsCommonClass,
                renderRightButton
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0",
                arrowsClassName,
              )}
              onClick={() => handleClickToScroll(256)}
            >
              <MdNavigateNext className="size-full" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
