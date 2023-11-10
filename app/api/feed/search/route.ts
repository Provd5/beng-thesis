import { db } from "~/lib/db";
import { SearchValidator } from "~/lib/validations/feed/search";

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const { searchCategory, searchText, sessionId } = SearchValidator.parse({
      searchCategory: url.searchParams.get("searchCategory"),
      searchText: url.searchParams.get("searchText"),
      sessionId: url.searchParams.get("sessionId"),
    });

    const data =
      searchCategory === "users"
        ? ({
            itemsFound: await db.profile.count({
              where: {
                full_name: { contains: searchText, mode: "insensitive" },
              },
            }),
            profile: await db.profile.findMany({
              where: {
                full_name: { contains: searchText, mode: "insensitive" },
              },
              select: {
                id: true,
                full_name: true,
                avatar_url: true,
                description: true,
                created_at: true,
                followed_by: {
                  select: { follower_id: true },
                },
                _count: {
                  select: {
                    bookshelf: { where: { bookshelf: "ALREADY_READ" } },
                    review: true,
                    liked_book: true,
                    followed_by: true,
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
                    },
                  },
                },
              },
            }),
          } as SearchProfilesInterface)
        : ({
            itemsFound: await db.book.count({
              where: {
                OR: [
                  { title: { contains: searchText, mode: "insensitive" } },
                  {
                    OR: [
                      {
                        isbn_10: { equals: searchText },
                      },
                      {
                        isbn_13: { equals: searchText },
                      },
                    ],
                  },
                ],
              },
            }),
            book: await db.book.findMany({
              where: {
                OR: [
                  { title: { contains: searchText, mode: "insensitive" } },
                  {
                    OR: [
                      {
                        isbn_10: { equals: searchText },
                      },
                      {
                        isbn_13: { equals: searchText },
                      },
                    ],
                  },
                ],
              },
              select: {
                id: true,
                title: true,
                authors: true,
                thumbnail_url: true,
                _count: { select: { review: true, liked_by: true } },
                review: { select: { rate: true } },
                ...(!!sessionId
                  ? {
                      bookshelf: { where: { profile: { id: sessionId } } },
                      book_owned_as: { where: { profile: { id: sessionId } } },
                      liked_by: { where: { profile: { id: sessionId } } },
                    }
                  : {}),
              },
            }),
          } as SearchBooksInterface);

    // on success
    return new Response(JSON.stringify(data));
  } catch (error) {
    return;
  }
}
