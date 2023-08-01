import type { FC } from "react";
import { Toaster, type ToasterProps } from "react-hot-toast";
import clsx from "clsx";

import { BsCheck } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";

export const ToasterComponent: FC<ToasterProps> = ({}) => {
  const sharedClass = "!rounded-xl !bg-white-light !font-semibold !text-base";

  return (
    <Toaster
      containerStyle={{
        top: 68,
        left: 10,
        bottom: 68,
        right: 10,
      }}
      toastOptions={{
        className: clsx(sharedClass, "!text-blue"),
        duration: 2000,
        icon: null,
        success: {
          className: clsx(sharedClass, "!text-green"),
          icon: <BsCheck className="mb-[-2px] mr-[-10px] shrink-0 text-xl" />,
        },
        error: {
          className: clsx(sharedClass, "!text-red"),
          icon: <RxCross2 className="mb-[-2px] mr-[-8px] shrink-0 text-lg" />,
          id: "errorToast",
        },
      }}
      position="bottom-center"
    />
  );
};
