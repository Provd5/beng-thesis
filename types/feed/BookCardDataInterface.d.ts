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
}

interface BookCardInterface {
  book: BookInterface;
}

interface BookReviewCardInterface {
  book: BookBaseInterface & {
    review: ReviewInterface[];
  };
}
