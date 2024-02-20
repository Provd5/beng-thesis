import type { FC } from "react";

import { getBookmarkIcon } from "~/components/ui/getBookmarkIcon";
import { calculateReadingTime } from "~/utils/calculateReadingTime";
import { convertTimeToDays } from "~/utils/convertTimeToDays";

import { AlreadyReadStatisticsLabels } from "./AlreadyReadStatisticsLabels";
import { TotalReadPagesStatistics } from "./ReadPagesStatistics";

interface AlreadyReadStatisticsCardProps {
  alreadyReadBooks: {
    began_reading_at: Date | null;
    updated_at: Date;
    book: {
      title: string;
      authors: string[];
      page_count: number;
    };
  }[];
}

export const AlreadyReadStatisticsCard: FC<AlreadyReadStatisticsCardProps> = ({
  alreadyReadBooks,
}) => {
  const lastReadBook = alreadyReadBooks.length > 0 && alreadyReadBooks[0];

  const lastReadBookReadTimeDiff =
    lastReadBook && lastReadBook.began_reading_at
      ? lastReadBook.updated_at.getTime() -
        lastReadBook.began_reading_at.getTime()
      : -1;

  const lastReadBookReadIn =
    lastReadBookReadTimeDiff >= 0
      ? convertTimeToDays(lastReadBookReadTimeDiff)
      : null;

  const totalReadPages =
    alreadyReadBooks.length > 0
      ? alreadyReadBooks.reduce((acc, num) => acc + num.book.page_count, 0)
      : 0;

  const mostPagesBook =
    alreadyReadBooks.length > 0 &&
    alreadyReadBooks.reduce((mostPagesBook, currentBook) => {
      const currentPages = currentBook.book.page_count;
      if (currentPages > mostPagesBook.book.page_count) {
        return currentBook;
      } else {
        return mostPagesBook;
      }
    });

  const readingTimeDifference =
    alreadyReadBooks.length > 0 &&
    alreadyReadBooks.reduce(
      (result, entry) => {
        if (
          entry.began_reading_at !== null &&
          entry.updated_at > entry.began_reading_at
        ) {
          const timeDifference =
            entry.updated_at.getTime() - entry.began_reading_at.getTime();

          if (
            timeDifference > 0 &&
            timeDifference < result.longestReadTimeDiff
          ) {
            result.longestReadTimeDiff = convertTimeToDays(timeDifference);
            result.longestReadBook = entry.book;
          }

          if (timeDifference > result.shortestReadTimeDiff) {
            result.shortestReadTimeDiff = convertTimeToDays(timeDifference);
            result.shortestReadBook = entry.book;
          }
        }
        return result;
      },
      {
        longestReadTimeDiff: Infinity,
        longestReadBook: {} as {
          title: string;
          authors: string[];
          page_count: number;
        },
        shortestReadTimeDiff: -Infinity,
        shortestReadBook: {} as {
          title: string;
          authors: string[];
          page_count: number;
        },
      }
    );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1 self-end">
        {getBookmarkIcon("ALREADY_READ")}
        <h2 className="font-semibold">{alreadyReadBooks.length}</h2>
      </div>
      {lastReadBook && (
        <AlreadyReadStatisticsLabels
          variant={"last:"}
          bookTitle={lastReadBook.book.title}
          bookAuthors={lastReadBook.book.authors}
          pages={lastReadBook.book.page_count}
          readTime={lastReadBookReadIn}
          updateDate={lastReadBook.updated_at}
        />
      )}
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {readingTimeDifference &&
          readingTimeDifference.longestReadTimeDiff !== Infinity && (
            <AlreadyReadStatisticsLabels
              variant={"longest-read:"}
              bookTitle={readingTimeDifference.longestReadBook.title}
              bookAuthors={readingTimeDifference.longestReadBook.authors}
              pages={readingTimeDifference.longestReadBook.page_count}
              readTime={readingTimeDifference.longestReadTimeDiff}
            />
          )}
        {readingTimeDifference &&
          readingTimeDifference.shortestReadTimeDiff !== -Infinity && (
            <AlreadyReadStatisticsLabels
              variant={"shortest-read:"}
              bookTitle={readingTimeDifference.shortestReadBook.title}
              bookAuthors={readingTimeDifference.shortestReadBook.authors}
              pages={readingTimeDifference.shortestReadBook.page_count}
              readTime={readingTimeDifference.shortestReadTimeDiff}
            />
          )}
      </div>
      {mostPagesBook && (
        <AlreadyReadStatisticsLabels
          variant={"book with most pages:"}
          bookTitle={mostPagesBook.book.title}
          bookAuthors={mostPagesBook.book.authors}
          pages={mostPagesBook.book.page_count}
          readTime={calculateReadingTime(
            mostPagesBook.began_reading_at,
            mostPagesBook.updated_at
          )}
        />
      )}
      <TotalReadPagesStatistics totalReadPages={totalReadPages} />
    </div>
  );
};
