"use client";

import { type FC, useState } from "react";

import { type modalSizes } from "~/types/sizes";

import { ModalWrapper } from "./ModalWrapper";

interface ModalInitiatorProps {
  children: React.ReactNode;
  initiatorStyle: React.ReactNode;
  size?: modalSizes;
  customModalStateHandler?: () => void;
}

export const ModalInitiator: FC<ModalInitiatorProps> = ({
  children,
  initiatorStyle,
  size = "default",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative flex">
      <button
        onKeyDown={(e) => e.key === "Escape" && setIsModalOpen(false)}
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        {initiatorStyle}
      </button>
      {isModalOpen && (
        <ModalWrapper
          size={size}
          closeModalHandler={() => setIsModalOpen(false)}
        >
          {children}
        </ModalWrapper>
      )}
    </div>
  );
};
