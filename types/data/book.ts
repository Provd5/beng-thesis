export interface GetBookInterface extends BookInterface {
  _count: {
    liked_by: number;
    review: number;
  };
}

export interface BookInterface {
  id: string;
  title: string;
  subtitle: string | null;
  authors: string[];
  publisher: string | null;
  published_date: string;
  description: string | null;
  isbn_10: string;
  isbn_13: string;
  page_count: number;
  thumbnail_url: string | null;
  categories: string[];
}

export interface BookOwnedAsInterface {
  added_book_at: Date | null;
  added_ebook_at: Date | null;
  added_audiobook_at: Date | null;
  updated_at: Date | null;
  user_id: string;
  book_id: string;
}

export interface LikedBookInterface {
  book_id: string;
  user_id: string;
  updated_at: Date;
}
