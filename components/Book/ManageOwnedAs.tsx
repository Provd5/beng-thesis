import type { FC } from "react";

import { ButtonLink } from "../ui/Buttons";
import { AsAudiobook, AsBook, AsEbook } from "./OwnedAsIcons";

interface ManageOwnedAsProps {
  addedEbookAt?: Date | null;
  addedAudiobookAt?: Date | null;
  addedBookAt?: Date | null;
}

export const ManageOwnedAs: FC<ManageOwnedAsProps> = ({
  addedEbookAt,
  addedAudiobookAt,
  addedBookAt,
}) => {
  const renderOwnedAsIcon = (condition: boolean, IconComponent: React.FC) => {
    return condition ? (
      <div className="h-8 w-8">
        <IconComponent />
      </div>
    ) : null;
  };

  return (
    <div className="flex flex-col">
      <ButtonLink className="self-start">Owned as</ButtonLink>
      <div className="flex gap-1">
        {renderOwnedAsIcon(!!addedEbookAt, AsEbook)}
        {renderOwnedAsIcon(!!addedAudiobookAt, AsAudiobook)}
        {renderOwnedAsIcon(!!addedBookAt, AsBook)}
      </div>
    </div>
  );
};
