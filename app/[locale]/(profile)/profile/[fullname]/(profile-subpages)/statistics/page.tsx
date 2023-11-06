import { notFound } from "next/navigation";

import { AlreadyReadStatisticsCard } from "~/components/Profile/Statistics/AlreadyReadStatistics/AlreadyReadStatisticsCard";
import { MainStatisticsCard } from "~/components/Profile/Statistics/MainStatisticsCard";
import { OwnedAsStatisticsCard } from "~/components/Profile/Statistics/OwnedAsStatistics/OwnedAsStatisticsCard";
import { StatisticsCategoryWrapper } from "~/components/Profile/Statistics/StatisticsCategoryWrapper";
import { db } from "~/lib/db";

export default async function StatisticsPage({
  params: { fullname },
}: {
  params: { fullname: string };
}) {
  const [userDataCount, alreadyReadBooks] = await Promise.all([
    db.profile.findUnique({
      where: {
        full_name: fullname,
      },
      select: {
        _count: {
          select: {
            liked_book: true,
            review: true,
          },
        },
        bookshelf: { select: { bookshelf: true } },
        book_owned_as: {
          where: {
            NOT: {
              AND: [
                { added_audiobook_at: null },
                { added_book_at: null },
                { added_ebook_at: null },
              ],
            },
          },
          select: {
            added_audiobook_at: true,
            added_book_at: true,
            added_ebook_at: true,
          },
        },
      },
    }),
    db.bookshelf.findMany({
      orderBy: { updated_at: "desc" },
      where: {
        AND: [
          { profile: { full_name: fullname } },
          { bookshelf: "ALREADY_READ" },
        ],
      },
      select: {
        began_reading_at: true,
        updated_at: true,
        book: { select: { title: true, authors: true, page_count: true } },
      },
    }),
  ]);

  if (!userDataCount) notFound();

  const quantities = {
    ownedQuantity: userDataCount.book_owned_as.length,
    likedQuantity: userDataCount._count.liked_book,
    reviewsQuantity: userDataCount._count.review,
  };

  return (
    <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
      {/* all categories statistics */}
      <StatisticsCategoryWrapper variant="profile statistics">
        <MainStatisticsCard
          quantities={quantities}
          bookshelfArray={userDataCount.bookshelf}
        />
      </StatisticsCategoryWrapper>

      {/* owned statistics */}
      <StatisticsCategoryWrapper variant="owned books">
        <OwnedAsStatisticsCard booksOwnedArray={userDataCount.book_owned_as} />
      </StatisticsCategoryWrapper>

      {/* reading statistics */}
      <StatisticsCategoryWrapper variant="read books">
        <AlreadyReadStatisticsCard alreadyReadBooks={alreadyReadBooks} />
      </StatisticsCategoryWrapper>
    </div>
  );
}
