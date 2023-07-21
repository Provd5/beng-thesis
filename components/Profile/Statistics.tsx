import type { FC } from "react";

interface StatisticsProps {}

export const Statistics: FC<StatisticsProps> = ({}) => {
  return (
    <div className="flex gap-2">
      <Box
        firstTitle={"Ukończone książki:"}
        firstText={"38"}
        secondTitle={"Ostatnio:"}
        secondText={
          "Harry Potter i kamień filozoficzny pneumonoultramicroscopicsilicovolcanoconiosis"
        }
      />
      <Box
        firstTitle={"Przeczytane strony:"}
        firstText={"3898"}
        secondTitle={"Najwięcej stron:"}
        secondText={"323 - Harry Potter i kamień filozoficzny"}
      />
      <Box
        firstTitle={"Najczęściej czytany autor:"}
        firstText={"J. K. Rowling"}
        secondTitle={"Przeczytane ksiązki od tego autora:"}
        secondText={"5"}
      />
    </div>
  );
};

interface BoxProps {
  firstTitle: string;
  firstText: string;
  secondTitle: string;
  secondText: string;
}

export const Box: FC<BoxProps> = ({
  firstTitle,
  firstText,
  secondTitle,
  secondText,
}) => {
  return (
    <>
      <div className="flex w-52 shrink-0 flex-col gap-2 rounded-lg bg-white-light px-6 py-4 dark:bg-black-dark">
        <div className="flex grow-0 flex-col">
          <h1 className="mb-1 text-xs font-bold">{firstTitle}</h1>
          <p className="truncate text-sm">{firstText}</p>
        </div>
        <div className="flex grow-0 flex-col">
          <h1 className="mb-1 text-xs font-bold">{secondTitle}</h1>
          <p className="truncate text-sm">{secondText}</p>
        </div>
      </div>
    </>
  );
};
