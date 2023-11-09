interface BookBaseInterface {
  id: string;
  title: string;
  authors: string[];
  thumbnail_url: string | null;
}

interface BookInterface extends BookBaseInterface {
  review: {
    rate: number;
  }[];
  _count: {
    review: number;
    liked_by: number;
  };
  bookshelf?: BookshelfInterface[] | null;
  book_owned_as?: BookOwnedAsInterface[] | null;
  liked_by?: LikedByInterface[] | null;
}

interface BookCardInterface {
  book: BookInterface;
}

interface BookReviewCardInterface {
  book: BookBaseInterface & {
    review: ReviewInterface[];
  };
}
