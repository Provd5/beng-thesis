"use client";

import type { FC } from "react";
import toast from "react-hot-toast";

import { demoLogin } from "~/lib/services/auth/actions";

export const DemoLogin: FC = () => {
  return (
    <div className="absolute inset-x-0 bottom-0">
      <button
        className="px-3 py-2"
        onClick={async () => {
          try {
            await demoLogin();
            toast.success("we will redirect you to your profile in a moment");
          } catch (error) {
            console.error(error);
          }
        }}
      >
        Login as TestUser
      </button>
    </div>
  );
};
