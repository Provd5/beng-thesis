import { db } from "~/lib/db";
import { ProfilesValidator } from "~/lib/validations/feed/profiles";

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const { userId, sessionId, variant, orderBy, order, takeLimit, page } =
      ProfilesValidator.parse({
        userId: url.searchParams.get("userId"),
        sessionId: url.searchParams.get("sessionId"),
        variant: url.searchParams.get("variant"),
        orderBy: url.searchParams.get("orderBy"),
        order: url.searchParams.get("order"),
        takeLimit: url.searchParams.get("takeLimit"),
        page: url.searchParams.get("page"),
      });

    const parsedTakeLimit = parseInt(takeLimit);
    const parsedSkip = (parseInt(page) - 1) * parseInt(takeLimit);

    let orderByClause = null;
    switch (orderBy) {
      case "full_name":
        orderByClause = { [orderBy]: order };
        break;
      case "book_owned_as":
      case "bookshelf":
      case "followed_by":
      case "review":
        orderByClause = { [orderBy]: { _count: order } };
        break;
      default:
        // sort by profile traffic
        orderByClause = [
          { review: { _count: order } },
          { review_reaction: { _count: order } },
          { followed_by: { _count: order } },
          { following: { _count: order } },
          { book_owned_as: { _count: order } },
          { bookshelf: { _count: order } },
          { liked_book: { _count: order } },
        ];
        break;
    }

    const whereClause = {
      id: !variant && sessionId ? { not: sessionId } : {},
      full_name: { not: null },
      ...(variant && userId
        ? variant === "followers"
          ? { following: { some: { following_id: userId } } }
          : variant === "following"
          ? { followed_by: { some: { follower_id: userId } } }
          : { private: { not: true } }
        : { private: { not: true } }),
    };

    const profiles = (await db.profile.findMany({
      take: parsedTakeLimit,
      skip: parsedSkip,
      where: whereClause,
      orderBy: orderByClause,
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
    })) as ProfileCardDataInterface[];

    // on success
    return new Response(JSON.stringify(profiles));
  } catch (error) {
    return new Error();
  }
}
