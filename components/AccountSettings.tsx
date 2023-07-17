import type { FC } from "react";

import { CgProfile } from "react-icons/cg";

import { getTranslator, type Locale } from "~/dictionaries";

import { LogoutButton } from "./LogoutButton";
import { ModalInitiator } from "./Modals/ModalInitiator";

interface AccountSettingsProps {
  params: { lang: Locale };
}

export const AccountSettings: FC<AccountSettingsProps> = async ({ params }) => {
  const { Other } = await getTranslator(params.lang);

  return (
    <>
      <ModalInitiator
        initiatorStyle={
          <div className="hover:scale-105">
            <CgProfile className="text-lg" />
          </div>
        }
      >
        <LogoutButton text={Other.Logout} />
      </ModalInitiator>
    </>
  );
};
