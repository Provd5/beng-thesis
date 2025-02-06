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
            await demoLogin();
            toast.success("we will redirect you to your profile in a moment");
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
