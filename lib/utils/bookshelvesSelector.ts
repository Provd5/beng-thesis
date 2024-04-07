export const bookshelvesSelector = (sessionId?: string) => {
  return {
    book: {
      include: {
        _count: { select: { review: true, liked_by: true } },
        review: { select: { rate: true } },
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
