import type { FC } from "react";
import { cookies } from "next/headers";

import { SlOptions } from "react-icons/sl";

import { defaultLocale, getTranslator, type Locale } from "~/dictionaries";

import { ModalInitiator } from "./Modals/ModalInitiator";
import { LanguageSwitcher } from "./Switchers/LanguageSwitcher";
import { ThemeSwitcher } from "./Switchers/ThemeSwitcher";

interface SettingsProps {
  params: { lang: Locale };
}

export const Settings: FC<SettingsProps> = async ({ params }) => {
  const { Settings, Theme } = await getTranslator(params.lang);

  const currentLang = (cookies().get("lang")?.value ?? defaultLocale) as Locale;
  // eslint-disable-next-line @typescript-eslint/require-await
  const setLangCookie = async (data: Locale) => {
    "use server";
    cookies().set("lang", data);
  };

  return (
    <>
      <div className="absolute right-4 top-3 md:right-6 md:top-5">
        <ModalInitiator
          initiatorStyle={
            <div className="hover:scale-105">
              <SlOptions />
            </div>
          }
        >
          <div className="flex grow flex-col items-center gap-3">
            <p className="text-xs">{Settings.appStyle}</p>
            <ThemeSwitcher
              defaultText={Theme.default}
              lightText={Theme.light}
              darkText={Theme.dark}
            />
            <p className="text-xs">{Settings.appLanguage}</p>
            <LanguageSwitcher
              currentLang={currentLang}
              setLangCookie={setLangCookie}
            />
          </div>
        </ModalInitiator>
      </div>
    </>
  );
};
