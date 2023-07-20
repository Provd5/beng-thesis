import type { FC } from "react";

import { CgProfile } from "react-icons/cg";

import { LogoutButton } from "./LogoutButton";
import { ModalInitiator } from "./Modals/ModalInitiator";

export const AccountSettings: FC = () => {
  return (
    <>
      <ModalInitiator
        initiatorStyle={
          <div className="hover:scale-105">
            <CgProfile className="text-lg" />
          </div>
        }
      >
        <LogoutButton />
      </ModalInitiator>
    </>
  );
};
