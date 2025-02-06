export const profileSelector = (userId: string | undefined) => {
  return {
    _count: {
      select: {
        followed_by: true,
        following: true,
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
        bookshelf: true,
        liked_book: true,
        review: true,
      },
    },
    ...(userId
      ? {
          followed_by: {
            where: {
              follower_id: userId,
            },
          },
        }
      : {}),
  };
};

export const bookshelvesSelector = (sessionId?: string) => {
  return {
    book: {
      include: {
        _count: { select: { review: true, liked_by: true } },
        review: { select: { rate: true, author_id: true, created_at: true } },
        ...(sessionId
          ? {
              book_owned_as: {
                where: { profile: { id: sessionId } },
              },
              bookshelf: {
                where: { profile: { id: sessionId } },
              },
              liked_by: {
                where: { profile: { id: sessionId } },
              },
            }
          : {}),
      },
    },
  };
};

export const bookshelfPreviewSelector = {
  book: {
    select: {
      id: true,
      title: true,
      authors: true,
      thumbnail_url: true,
    },
  },
};
