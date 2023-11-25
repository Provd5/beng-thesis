import type { FC } from "react";

import { FaCog } from "react-icons/fa";

import { LanguageSwitcher } from "../Switchers/LanguageSwitcher";
import { ThemeSwitcher } from "../Switchers/ThemeSwitcher";
import { ModalInitiator } from "./ModalInitiator";
import { SettingsLabel } from "./SettingsLabel";

export const Settings: FC = ({}) => {
  return (
    <>
      <ModalInitiator
        initiatorStyle={
          <div className="transition-transform hover:rotate-90 hover:scale-110">
            <FaCog className="h-6 w-6" />
          </div>
        }
      >
        <div className="flex grow flex-col items-center gap-3 whitespace-nowrap">
          <SettingsLabel label="app style" />
          <ThemeSwitcher />
          <SettingsLabel label="app language" />
          <LanguageSwitcher />
        </div>
      </ModalInitiator>
    </>
  );
};
