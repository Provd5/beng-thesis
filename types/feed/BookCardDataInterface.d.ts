interface BookInterface {
  id: string;
  title: string;
  authors: string[];
  thumbnail_url: string | null;
}

interface BookCardInterface {
  book: BookInterface;
}

interface BookReviewCardInterface {
  book: BookInterface & {
    review: ReviewInterface[];
  };
}
