import type { FC } from "react";

import { HIGHEST_REVIEW_RATE } from "~/types/data/review";

import { AverageRateLabel } from "./AverageRateLabel";

interface AverageRateProps {
  averageRate: number;
}

export const AverageRate: FC<AverageRateProps> = ({ averageRate }) => {
  return (
    <div className="flex flex-col pt-0.5">
      <AverageRateLabel />
      <p className="text-md">{`${averageRate}/${HIGHEST_REVIEW_RATE}`}</p>
    </div>
  );
};
