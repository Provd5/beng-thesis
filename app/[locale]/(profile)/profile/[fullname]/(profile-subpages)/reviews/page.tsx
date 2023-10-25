import Link from "next/link";

import { BookCover } from "~/components/Book/BookCover";
import { BookReviewCard } from "~/components/Explore/BookReviewCard";
import { BookshelfPageTitle } from "~/components/Profile/Bookshelf/BookshelfPageTitle";
import { db } from "~/lib/db";

export default async function ReviewsPage({
  params: { fullname },
}: {
  params: { fullname: string };
}) {
  const books = await db.review.findMany({
    orderBy: { updated_at: "desc" },
    where: { profile: { full_name: fullname } },
    select: {
      book: {
        select: {
          id: true,
          title: true,
          authors: true,
          thumbnail_url: true,
          review: {
            where: { profile: { full_name: fullname } },
            include: {
              review_reaction: { where: { profile: { full_name: fullname } } },
            },
          },
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <BookshelfPageTitle
        booksQuantity={books.length}
        categoryVariant={"REVIEWS"}
      />
      <div className="grid grid-cols-1 gap-5">
        {books?.map(({ book }) => {
          const myReview = book.review?.[0];
          const okReactions = myReview?.review_reaction.filter(
            ({ reaction }) => reaction === "OK"
          );

          return (
            <div className="" key={book.id}>
              <Link
                href={`/book/${book.id}/${book.title}`}
                className="float-left h-fit w-fit pr-3"
              >
                <BookCover coverUrl={book.thumbnail_url} />
              </Link>
              <div>
                <Link
                  href={`/book/${book.id}/${book.title}`}
                  className="self-start"
                >
                  <h1 className="line-clamp-2">{book.title}</h1>
                  <p className="text-sm text-black-light dark:text-white-dark">
                    {book.authors.join(", ")}
                  </p>
                </Link>
                {myReview && (
                  <BookReviewCard
                    score={myReview.score}
                    createdAt={myReview.created_at}
                    updatedAt={myReview.updated_at}
                    text={myReview.text}
                    okReactions={okReactions.length}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
