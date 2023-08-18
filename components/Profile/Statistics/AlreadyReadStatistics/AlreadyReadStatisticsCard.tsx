import type { FC } from "react";

import { getBookmarkIcon } from "~/components/ui/getBookmarkIcon";
import { db } from "~/lib/db";
import { calculateReadingTime } from "~/utils/calculateReadingTime";
import { convertTimeToDays } from "~/utils/convertTimeToDays";

import { AlreadyReadStatisticsLabels } from "./AlreadyReadStatisticsLabels";
import { TotalReadPagesStatistics } from "./ReadPagesStatistics";

interface AlreadyReadStatisticsCardProps {
  userId: string;
}

export const AlreadyReadStatisticsCard: FC<
  AlreadyReadStatisticsCardProps
> = async ({ userId }) => {
  const alreadyReadBooks = await db.bookshelf.findMany({
    orderBy: { updated_at: "desc" },
    where: {
      AND: [{ user_id: userId }, { bookshelf: "ALREADY_READ" }],
    },
    select: {
      began_reading_at: true,
      updated_at: true,
      book: { select: { title: true, authors: true, page_count: true } },
    },
  });

  const lastReadBook = alreadyReadBooks[0];

  const lastReadBookReadTimeDiff = lastReadBook.began_reading_at
    ? lastReadBook.updated_at.getTime() -
      lastReadBook.began_reading_at.getTime()
    : -1;

  const lastReadBookReadIn =
    lastReadBookReadTimeDiff >= 0
      ? convertTimeToDays(lastReadBookReadTimeDiff)
      : null;

  const totalReadPages = alreadyReadBooks.reduce(
    (acc, num) => acc + num.book.page_count,
    0
  );

  const mostPagesBook = alreadyReadBooks.reduce(
    (mostPagesBook, currentBook) => {
      const currentPages = currentBook.book.page_count;
      if (currentPages > mostPagesBook.book.page_count) {
        return currentBook;
      } else {
        return mostPagesBook;
      }
    }
  );

  const readingTimeDifference = alreadyReadBooks.reduce(
    (result, entry) => {
      if (
        entry.began_reading_at !== null &&
        entry.updated_at > entry.began_reading_at
      ) {
        const timeDifference =
          entry.updated_at.getTime() - entry.began_reading_at.getTime();

        if (
          timeDifference > 0 &&
          timeDifference < result.shortestReadTimeDiff
        ) {
          result.shortestReadTimeDiff = convertTimeToDays(timeDifference);
          result.shortestReadBook = entry.book;
        }

        if (timeDifference > result.longestReadTimeDiff) {
          result.longestReadTimeDiff = convertTimeToDays(timeDifference);
          result.longestReadBook = entry.book;
        }
      }
      return result;
    },
    {
      shortestReadTimeDiff: Infinity,
      shortestReadBook: {} as {
        title: string;
        authors: string[];
        page_count: number;
      },
      longestReadTimeDiff: -Infinity,
      longestReadBook: {} as {
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

      <AlreadyReadStatisticsLabels
        variant={"last:"}
        bookTitle={lastReadBook.book.title}
        bookAuthors={lastReadBook.book.authors}
        pages={lastReadBook.book.page_count}
        readTime={lastReadBookReadIn}
      />
      <div className="flex flex-wrap gap-3">
        {readingTimeDifference.shortestReadTimeDiff !== Infinity && (
          <AlreadyReadStatisticsLabels
            variant={"shortest-read:"}
            bookTitle={readingTimeDifference.shortestReadBook.title}
            bookAuthors={readingTimeDifference.shortestReadBook.authors}
            pages={readingTimeDifference.shortestReadBook.page_count}
            readTime={readingTimeDifference.shortestReadTimeDiff}
          />
        )}
        {readingTimeDifference.longestReadTimeDiff !== Infinity && (
          <AlreadyReadStatisticsLabels
            variant={"longest-read:"}
            bookTitle={readingTimeDifference.longestReadBook.title}
            bookAuthors={readingTimeDifference.longestReadBook.authors}
            pages={readingTimeDifference.longestReadBook.page_count}
            readTime={readingTimeDifference.longestReadTimeDiff}
          />
        )}
      </div>
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
      <TotalReadPagesStatistics totalReadPages={totalReadPages} />
    </div>
  );
};
