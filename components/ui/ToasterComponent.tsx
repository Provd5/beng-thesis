import type { FC } from "react";
import { Toaster, type ToasterProps } from "react-hot-toast";
import clsx from "clsx";

import { BsCheck } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";

import { Loader } from "./Loaders/Loader";

export const ToasterComponent: FC<ToasterProps> = ({}) => {
  const sharedClass = "!rounded-lg !bg-white-light !font-semibold !text-sm";

  return (
    <Toaster
      gutter={4}
      containerClassName="!inset-x-[10px] !top-[10px] mb-3 !bottom-[var(--nav-height)] md:!bottom-[10px]"
      toastOptions={{
        className: clsx(sharedClass, "!text-blue"),
        duration: 4000,
        icon: null,
        success: {
          className: clsx(sharedClass, "!text-green"),
          icon: <BsCheck className="mb-[-2px] mr-[-10px] flex-none text-xl" />,
        },
        error: {
          className: clsx(sharedClass, "!text-red"),
          icon: <RxCross2 className="mb-[-2px] mr-[-8px] flex-none text-lg" />,
          id: "errorToast",
        },
        loading: {
          className: clsx(sharedClass, "!text-gray !text-xs"),
          icon: (
            <div className="mr-[-8px] h-3.5 w-3.5 flex-none">
              <Loader />
            </div>
          ),
          id: "loadingToast",
          duration: Infinity,
        },
      }}
      position="bottom-left"
    />
  );
};
