import { db } from "~/lib/db";
import { BooksValidator } from "~/lib/validations/feed/books";

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const { userId, profileName, variant, orderBy, order, takeLimit, page } =
      BooksValidator.parse({
        userId: url.searchParams.get("userId"),
        profileName: url.searchParams.get("profileName"),
        variant: url.searchParams.get("variant"),
        orderBy: url.searchParams.get("orderBy"),
        order: url.searchParams.get("order"),
        takeLimit: url.searchParams.get("takeLimit"),
        page: url.searchParams.get("page"),
      });

    let orderByClause = {};
    switch (orderBy) {
      case "authors":
        orderByClause = { authors: order || "desc" };
        break;
      case "publisher":
        orderByClause = { publisher: order || "desc" };
        break;
      case "title":
        orderByClause = { title: order || "desc" };
        break;
      case "liked_by_count":
        orderByClause = { liked_by: { _count: order || "desc" } };
        break;
      case "review_count":
        orderByClause = { review: { _count: order || "desc" } };
        break;
      default:
      case "published_date":
        orderByClause = { published_date: order || "desc" };
        break;
    }

    const baseSelect = {
      id: true,
      title: true,
      authors: true,
      thumbnail_url: true,
    };

    const selectClause =
      variant === "REVIEWS"
        ? {
            ...baseSelect,
            review: {
              where: { profile: { full_name: profileName } },
              include: {
                review_reaction: {
                  where: { profile: { full_name: profileName } },
                },
              },
            },
          }
        : {
            ...baseSelect,
            _count: { select: { review: true, liked_by: true } },
            review: { select: { score: true } },
            ...(!!userId
              ? {
                  bookshelf: { where: { profile: { id: userId } } },
                  book_owned_as: { where: { profile: { id: userId } } },
                  liked_by: { where: { profile: { id: userId } } },
                }
              : {}),
          };

    let whereClause = {};
    switch (variant) {
      case "ABANDONED":
        whereClause = {
          bookshelf: {
            some: {
              bookshelf: "ABANDONED",
              profile: { full_name: profileName },
            },
          },
        };
        break;
      case "ALREADY_READ":
        whereClause = {
          bookshelf: {
            some: {
              bookshelf: "ALREADY_READ",
              profile: { full_name: profileName },
            },
          },
        };
        break;
      case "OTHER":
        whereClause = {
          bookshelf: {
            some: { bookshelf: "OTHER", profile: { full_name: profileName } },
          },
        };
        break;
      case "READING":
        whereClause = {
          bookshelf: {
            some: { bookshelf: "READING", profile: { full_name: profileName } },
          },
        };
        break;
      case "TO_READ":
        whereClause = {
          bookshelf: {
            some: { bookshelf: "TO_READ", profile: { full_name: profileName } },
          },
        };
        break;
      case "LIKED":
        whereClause = {
          liked_by: { some: { profile: { full_name: profileName } } },
        };
        break;
      case "OWNED":
        whereClause = {
          book_owned_as: {
            some: {
              profile: { full_name: profileName },
              NOT: {
                AND: [
                  { added_audiobook_at: null },
                  { added_book_at: null },
                  { added_ebook_at: null },
                ],
              },
            },
          },
        };
        break;
      case "REVIEWS":
        whereClause = {
          review: { some: { profile: { full_name: profileName } } },
        };
        break;
      default:
        break;
    }

    const books = await db.book.findMany({
      where: whereClause,
      orderBy: orderByClause,
      take: parseInt(takeLimit),
      skip: (parseInt(page) - 1) * parseInt(takeLimit),
      select: selectClause,
    });

    // on success
    return new Response(JSON.stringify(books));
  } catch (error) {
    return new Error();
  }
}
