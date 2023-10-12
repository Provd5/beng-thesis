import type { FC } from "react";

import { ButtonWhite } from "~/components/ui/Buttons";

interface ManageProfileDescriptionProps {
  userDescription: string | null;
}

export const ManageProfileDescription: FC<ManageProfileDescriptionProps> = ({
  userDescription,
}) => {
  return (
    <>
      <div className="flex flex-col items-start">
        <h1 className="text-md">Profile description:</h1>
        <p className="mb-3 text-xs">{userDescription}</p>
        <ButtonWhite size="xs">Edit description</ButtonWhite>
      </div>
    </>
  );
};
