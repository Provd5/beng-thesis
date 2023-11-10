import { db } from "~/lib/db";
import { BooksValidator } from "~/lib/validations/feed/books";

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const { sessionId, profileName, variant, orderBy, order, takeLimit, page } =
      BooksValidator.parse({
        sessionId: url.searchParams.get("sessionId"),
        profileName: url.searchParams.get("profileName"),
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
      case "authors":
      case "publisher":
      case "title":
      case "published_date":
        orderByClause = { [orderBy]: order };
        break;
      case "liked_by":
      case "review":
        orderByClause = { [orderBy]: { _count: order } };
        break;
      default:
        orderByClause = null;
        break;
    }

    const commonSelect = {
      id: true,
      title: true,
      authors: true,
      thumbnail_url: true,
    };

    const selectClause =
      variant === "REVIEWS"
        ? {
            ...commonSelect,
            review: {
              where: { profile: { full_name: profileName } },
              include: {
                review_reaction: true,
              },
            },
          }
        : {
            ...commonSelect,
            _count: { select: { review: true, liked_by: true } },
            review: { select: { rate: true } },
            ...(!!sessionId
              ? {
                  bookshelf: { where: { profile: { id: sessionId } } },
                  book_owned_as: { where: { profile: { id: sessionId } } },
                  liked_by: { where: { profile: { id: sessionId } } },
                }
              : {}),
          };

    let books: (BookCardInterface | BookReviewCardInterface | BookInterface)[] =
      [];
    switch (variant) {
      case "OWNED":
        books = (await db.book_owned_as.findMany({
          where: {
            profile: { full_name: profileName },
            NOT: {
              AND: [
                { added_audiobook_at: null },
                { added_book_at: null },
                { added_ebook_at: null },
              ],
            },
          },
          orderBy: orderByClause
            ? { book: orderByClause }
            : // sort by newly added
              [
                { added_book_at: order },
                { added_ebook_at: order },
                { added_audiobook_at: order },
              ],
          take: parsedTakeLimit,
          skip: parsedSkip,
          select: {
            book: {
              select: selectClause,
            },
          },
        })) as BookCardInterface[];
        break;
      case "REVIEWS":
        books = (await db.review.findMany({
          where: { profile: { full_name: profileName } },
          orderBy: orderByClause
            ? { book: orderByClause }
            : // sort by newly added
              [{ created_at: order }, { updated_at: order }],
          take: parsedTakeLimit,
          skip: parsedSkip,
          select: {
            book: {
              select: selectClause,
            },
          },
        })) as BookReviewCardInterface[];
        break;
      case "LIKED":
        books = (await db.liked_books.findMany({
          where: { profile: { full_name: profileName } },
          orderBy: orderByClause
            ? { book: orderByClause }
            : // sort by newly added
              { updated_at: order },
          take: parsedTakeLimit,
          skip: parsedSkip,
          select: {
            book: {
              select: selectClause,
            },
          },
        })) as BookCardInterface[];
        break;
      case null:
      case undefined:
        books = (await db.book.findMany({
          orderBy: orderByClause
            ? orderByClause
            : // sort by popularity
              [
                { liked_by: { _count: order } },
                { review: { _count: order } },
                { book_owned_as: { _count: order } },
                { bookshelf: { _count: order } },
              ],
          take: parsedTakeLimit,
          skip: parsedSkip,
          select: selectClause,
        })) as BookInterface[];
        break;
      default:
        books = (await db.bookshelf.findMany({
          where: { bookshelf: variant, profile: { full_name: profileName } },
          orderBy: orderByClause
            ? { book: orderByClause }
            : // sort by newly added
              { updated_at: order },
          take: parsedTakeLimit,
          skip: parsedSkip,
          select: {
            book: {
              select: selectClause,
            },
          },
        })) as BookCardInterface[];
        break;
    }

    // on success
    return new Response(JSON.stringify(books));
  } catch (error) {
    return;
  }
}
