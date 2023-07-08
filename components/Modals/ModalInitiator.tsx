"use client";

import { type FC, useState } from "react";

import { ModalWrapper } from "./ModalWrapper";

interface ModalInitiatorProps {
  children: React.ReactNode;
  initiatorStyle: React.ReactNode;
}

export const ModalInitiator: FC<ModalInitiatorProps> = ({
  children,
  initiatorStyle,
}) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="relative flex">
      <button
        onKeyDown={(e) => e.key === "Escape" && setOpenModal(false)}
        onClick={() => setOpenModal(!openModal)}
      >
        {initiatorStyle}
      </button>
      {openModal && (
        <ModalWrapper setOpenModal={setOpenModal}>{children}</ModalWrapper>
      )}
    </div>
  );
};
