"use client";

import { type FC, useTransition } from "react";

import { type BookshelvesTypes } from "~/types/consts";

import { CategoryLinksContainer } from "../Links/CategoryLinksContainer";
import { DragContainer } from "../ui/DragContainer";
import { LargeComponentLoader } from "../ui/Loaders/Loader";

interface BookshelfContainerProps {
  children: React.ReactNode;
  bookshelf: BookshelvesTypes;
}

export const BookshelfContainer: FC<BookshelfContainerProps> = ({
  children,
  bookshelf,
}) => {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <DragContainer
        arrowSize="sm"
        containerClassName="flex-start py-1 px-0.5 hidden-scrollbar gap-1"
      >
        <CategoryLinksContainer
          currentBookshelf={bookshelf}
          startTransition={startTransition}
        />
      </DragContainer>
      <div className="flex flex-col">
        {isPending ? <LargeComponentLoader /> : children}
      </div>
    </>
  );
};
