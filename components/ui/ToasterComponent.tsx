import type { FC } from "react";
import { Toaster, type ToasterProps } from "react-hot-toast";

import { BsCheck } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";

export const ToasterComponent: FC<ToasterProps> = ({}) => {
  return (
    <Toaster
      containerStyle={{
        top: 68,
        left: 10,
        bottom: 68,
        right: 10,
      }}
      toastOptions={{
        success: {
          className:
            "!text-green !rounded-xl !bg-white-light !font-semibold !text-base",
          icon: <BsCheck className="mb-[-2px] mr-[-10px] shrink-0 text-xl" />,
        },
        error: {
          className:
            "!text-red !rounded-xl !bg-white-light !font-semibold !text-base",
          icon: <RxCross2 className="mb-[-2px] mr-[-8px] shrink-0 text-lg" />,
        },
      }}
      position="bottom-center"
    />
  );
};
