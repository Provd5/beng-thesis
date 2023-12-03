import { db } from "~/lib/db";
import readUserSession from "~/lib/supabase/readUserSession";
import { BooksValidator } from "~/lib/validations/feed/books";

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const {
      data: { session },
    } = await readUserSession();

    const { profileName, variant, orderBy, order, takeLimit, page } =
      BooksValidator.parse({
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
      case "title":
      case "published_date":
        orderByClause = { book: { [orderBy]: order } };
        break;
      case "liked_by":
      case "review":
        orderByClause = { book: { [orderBy]: { _count: order } } };
        break;
      case "last_added":
        orderByClause = null;
        break;
      case "popularity":
      default:
        orderByClause = [
          { book: { liked_by: { _count: order } } },
          { book: { review: { _count: order } } },
          { book: { book_owned_as: { _count: order } } },
          { book: { bookshelf: { _count: order } } },
        ];
        break;
    }

    let bookOrderByClause = null;
    switch (orderBy) {
      case "authors":
      case "title":
      case "published_date":
        bookOrderByClause = { [orderBy]: order };
        break;
      case "liked_by":
      case "review":
        bookOrderByClause = { [orderBy]: { _count: order } };
        break;
      case "last_added":
      case "popularity":
      default:
        bookOrderByClause = [
          { liked_by: { _count: order } },
          { review: { _count: order } },
          { book_owned_as: { _count: order } },
          { bookshelf: { _count: order } },
        ];
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
            ...(!!session?.user
              ? {
                  bookshelf: { where: { profile: { id: session.user.id } } },
                  book_owned_as: {
                    where: { profile: { id: session.user.id } },
                  },
                  liked_by: { where: { profile: { id: session.user.id } } },
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
            ? orderByClause
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
            ? orderByClause
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
            ? orderByClause
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
          orderBy: bookOrderByClause,
          take: parsedTakeLimit,
          skip: parsedSkip,
          select: selectClause,
        })) as BookInterface[];
        break;
      default:
        books = (await db.bookshelf.findMany({
          where: { bookshelf: variant, profile: { full_name: profileName } },
          orderBy: orderByClause
            ? orderByClause
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
    console.log(error);

    return [];
  }
}
