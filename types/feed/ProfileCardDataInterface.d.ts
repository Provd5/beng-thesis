interface ProfileCardDataInterface {
  id: string;
  full_name: string;
  avatar_url: string | null;
  description: string | null;
  created_at: Date;
  followed_by: {
    follower_id: string;
  }[];
  _count: {
    bookshelf: number;
    review: number;
    liked_book: number;
    followed_by: number;
    book_owned_as: number;
  };
}
