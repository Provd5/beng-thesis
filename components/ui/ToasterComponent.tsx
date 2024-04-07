import type { FC } from "react";
import { Toaster, type ToasterProps } from "react-hot-toast";

import { BsCheck } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";

import { cn } from "~/utils/cn";

import { Loader } from "./Loaders/Loader";

export const ToasterComponent: FC<ToasterProps> = ({}) => {
  const sharedClass = "!rounded-lg !bg-white !font-semibold !text-sm";

  return (
    <Toaster
      gutter={4}
      containerClassName="!inset-x-[10px] !top-[10px] mb-3 !bottom-[var(--nav-height)] md:!bottom-[10px]"
      toastOptions={{
        className: cn(sharedClass, "!text-colors-blue"),
        duration: 4000,
        icon: null,
        success: {
          className: cn(sharedClass, "!text-colors-green"),
          icon: <BsCheck className="mb-[-2px] mr-[-10px] flex-none text-xl" />,
        },
        error: {
          className: cn(sharedClass, "!text-colors-red"),
          icon: <RxCross2 className="mb-[-2px] mr-[-8px] flex-none text-lg" />,
          id: "errorToast",
        },
        loading: {
          className: cn(sharedClass, "!text-colors-gray !text-xs"),
          icon: (
            <div className="mr-[-8px] size-3.5 flex-none">
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
