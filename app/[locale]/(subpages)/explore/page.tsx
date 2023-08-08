import { BookCard } from "~/components/Explore/BookCard";
import { db } from "~/lib/db";

export default async function ExplorePage() {
  const books = await db.book.findMany({
    select: {
      id: true,
      title: true,
      authors: true,
      thumbnail_url: true,
      review: { select: { score: true } },
      _count: { select: { review: true, liked_by: true } },
    },
    orderBy: { published_date: "desc" },
  });

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {books?.map((book) => (
          <BookCard key={book.id} bookData={book} />
        ))}
      </div>
    </div>
  );
}
