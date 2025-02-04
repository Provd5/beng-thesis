import type { FC } from "react";

import { getAllBookshelvesQuantity } from "~/lib/services/statistics/queries";

import { MainStatisticsLabel } from "./MainStatisticsLabel";

interface MainStatisticsCardProps {
  profileName: string;
}

export const MainStatisticsCard: FC<MainStatisticsCardProps> = async ({
  profileName,
}) => {
  const quantities = await getAllBookshelvesQuantity(profileName);

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <MainStatisticsLabel label="ABANDONED" value={quantities.abandoned} />
      <MainStatisticsLabel
        label="ALREADY_READ"
        value={quantities.already_read}
      />
      <MainStatisticsLabel label="LIKED" value={quantities.liked_book} />
      <MainStatisticsLabel label="OTHER" value={quantities.other} />
      <MainStatisticsLabel label="OWNED" value={quantities.book_owned_as} />
      <MainStatisticsLabel label="READING" value={quantities.reading} />
      <MainStatisticsLabel label="REVIEWS" value={quantities.review} />
      <MainStatisticsLabel label="TO_READ" value={quantities.to_read} />
    </div>
  );
};
