"use client";

import type { FC } from "react";
import toast from "react-hot-toast";

import { demoLogin } from "~/lib/services/auth/actions";

import { ButtonWhite } from "../ui/Buttons";

export const DemoLogin: FC = () => {
  return (
    <div className="nav-padding absolute bottom-3 left-3">
      <ButtonWhite
        size="xs"
        onClick={async () => {
          try {
            const res = await demoLogin();
            if (!res.success) {
              throw new Error(res.error);
            }
            toast.success("Redirecting to demo profile");
          } catch (error) {
            console.error(error);
          }
        }}
      >
        Login as TestUser
      </ButtonWhite>
    </div>
  );
};
