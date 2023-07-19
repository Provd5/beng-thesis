"use client";

import { type FC, type FormEvent, useState } from "react";

import { dateFormater } from "~/utils/dateFormater";
import { UsernameValidator } from "~/utils/validations/auth";

import { AvatarImage } from "../ui/AvatarImage";
import { ButtonWhite } from "../ui/Buttons";

interface CreateUsernameProps {
  avatarSrc: string | null;
  email: string;
  createdAt: Date;
}

export const CreateUsername: FC<CreateUsernameProps> = ({
  avatarSrc,
  email,
  createdAt,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const defaultUsername = email.split("@")[0];

  const handleCreateUsername = (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(false);
    setErrorMsg("");
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const username = form.elements.namedItem("username") as HTMLInputElement;
    console.log(UsernameValidator.parse(username.value));

    setIsLoading(true);
  };

  return (
    <div className="relative flex h-full flex-col items-center justify-between px-3 py-6 text-sm text-white-light">
      <AvatarImage avatarSrc={avatarSrc} className="h-10 w-10" />
      <p>{email}</p>
      <p>Created: {dateFormater(createdAt, true)}</p>
      <p>Your account dont have username yet. create</p>
      <form
        className="flex max-w-sm flex-1 flex-col items-center justify-center justify-center gap-1"
        onSubmit={handleCreateUsername}
      >
        <div className="flex flex-col">
          <label className="ml-3" htmlFor="username-input">
            Username:
          </label>
          <input
            className="w-64 rounded-lg bg-white px-3 py-2 text-md text-black dark:bg-black dark:text-white"
            id="username-input"
            type="text"
            name="username"
            placeholder="Create your username..."
            defaultValue={defaultUsername}
            required
            autoComplete="off"
          />
        </div>
        <ButtonWhite loading={isLoading} type="submit" className="uppercase">
          create
        </ButtonWhite>
      </form>
    </div>
  );
};
