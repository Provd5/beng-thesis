import { cookies } from "next/headers";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { type ReviewCardDataInterface } from "~/types/feed/ReviewCardDataInterface";

import { db } from "~/lib/db";
import { ReviewsValidator } from "~/lib/validations/feed/reviews";

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

    const { bookId, isMyReview, orderBy, order, takeLimit, page } =
      ReviewsValidator.parse({
        bookId: url.searchParams.get("bookId"),
        isMyReview: url.searchParams.get("isMyReview"),
        orderBy: url.searchParams.get("orderBy"),
        order: url.searchParams.get("order"),
        takeLimit: url.searchParams.get("takeLimit"),
        page: url.searchParams.get("page"),
      });

    const parsedTakeLimit = parseInt(takeLimit);
    const parsedSkip = (parseInt(page) - 1) * parseInt(takeLimit);

    let orderByClause = null;
    switch (orderBy) {
      case "created_at":
      case "rate":
        orderByClause = { [orderBy]: order };
        break;
      case "review_reaction":
        orderByClause = { [orderBy]: { _count: order } };
        break;
      case "profile_traffic":
      default:
        orderByClause = [
          { profile: { review: { _count: order } } },
          { profile: { review_reaction: { _count: order } } },
          { profile: { followed_by: { _count: order } } },
          { profile: { following: { _count: order } } },
          { profile: { book_owned_as: { _count: order } } },
          { profile: { bookshelf: { _count: order } } },
          { profile: { liked_book: { _count: order } } },
        ];
        break;
    }

    if (isMyReview === "true" && !session?.user)
      return new Response(JSON.stringify([]));

    const whereClause = isMyReview
      ? { AND: [{ book_id: bookId }, { author_id: session?.user.id }] }
      : {
          book_id: bookId,
          text: { not: null },
          profile: {
            full_name: { not: null },
          },
        };

    const reviews = (await db.review.findMany({
      take: parsedTakeLimit,
      skip: parsedSkip,
      where: whereClause,
      orderBy: orderByClause,
      select: {
        id: true,
        rate: true,
        text: true,
        updated_at: true,
        created_at: true,
        review_reaction: true,
        profile: {
          select: {
            id: true,
            avatar_url: true,
            full_name: true,
            created_at: true,
            _count: {
              select: {
                bookshelf: {
                  where: { bookshelf: { equals: "ALREADY_READ" } },
                },
                review: true,
                liked_book: { where: { book_id: bookId } },
              },
            },
          },
        },
      },
    })) as ReviewCardDataInterface[];

    // on success
    return new Response(JSON.stringify(reviews));
  } catch (error) {
    return;
  }
}
