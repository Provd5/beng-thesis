"use client";

import type { FC } from "react";
import { useState } from "react";

import { HiMiniLanguage } from "react-icons/hi2";
import { IoInvertMode } from "react-icons/io5";

import { ThemeSwitcher } from "./ThemeSwitcher";
import { ModalWrapper } from "./ui/ModalWrapper";

export const Settings: FC = ({}) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="absolute right-3 top-4 flex gap-2">
        <div className="relative">
          <div
            tabIndex={0}
            className="cursor-pointer hover:scale-105"
            onKeyDown={(e) => e.key === "Enter" && setOpenModal(!openModal)}
            onClick={() => setOpenModal(!openModal)}
          >
            <IoInvertMode />
          </div>
          {openModal && (
            <ModalWrapper>
              <ThemeSwitcher />
            </ModalWrapper>
          )}
        </div>
        <div>
          <HiMiniLanguage />
        </div>
      </div>
    </>
  );
};
