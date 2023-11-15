import type { FC } from "react";
import Link from "next/link";
import { type bookshelfType } from "@prisma/client";

import { MainStatisticsCard } from "./MainStatisticsCard";
import { StatisticsCategoryWrapper } from "./StatisticsCategoryWrapper";

interface StatisticsProps {
  userFullname: string;
  quantities: {
    ownedQuantity: number;
    likedQuantity: number;
    reviewsQuantity: number;
  };
  bookshelfArray:
    | {
        bookshelf: bookshelfType | null;
      }[];
}

export const Statistics: FC<StatisticsProps> = ({
  userFullname,
  quantities,
  bookshelfArray,
}) => {
  return (
    <div className="flex justify-center md:justify-start">
      <Link href={`${userFullname}/statistics/`}>
        <StatisticsCategoryWrapper variant="profile statistics">
          <MainStatisticsCard
            quantities={quantities}
            bookshelfArray={bookshelfArray}
          />
        </StatisticsCategoryWrapper>
      </Link>
    </div>
  );
};
