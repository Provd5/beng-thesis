import { cookies } from "next/headers";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { db } from "~/lib/db";
import { SearchValidator } from "~/lib/validations/feed/search";

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { searchCategory, searchText } = SearchValidator.parse({
      searchCategory: url.searchParams.get("searchCategory"),
      searchText: url.searchParams.get("searchText"),
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
                    description: { contains: searchText, mode: "insensitive" },
                  },
                  { subtitle: { contains: searchText, mode: "insensitive" } },
                  { authors: { has: searchText } },
                  { isbn_10: { equals: searchText } },
                  { isbn_13: { equals: searchText } },
                ],
              },
            }),
            book: await db.book.findMany({
              where: {
                OR: [
                  { title: { contains: searchText, mode: "insensitive" } },
                  {
                    description: { contains: searchText, mode: "insensitive" },
                  },
                  { subtitle: { contains: searchText, mode: "insensitive" } },
                  { authors: { has: searchText } },
                  { isbn_10: { equals: searchText } },
                  { isbn_13: { equals: searchText } },
                ],
              },
              select: {
                id: true,
                title: true,
                authors: true,
                thumbnail_url: true,
                _count: { select: { review: true, liked_by: true } },
                review: { select: { rate: true } },
                ...(!!session?.user
                  ? {
                      bookshelf: {
                        where: { profile: { id: session.user.id } },
                      },
                      book_owned_as: {
                        where: { profile: { id: session.user.id } },
                      },
                      liked_by: { where: { profile: { id: session.user.id } } },
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
