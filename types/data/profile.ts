export interface GetProfileInterface extends ProfileInterface {
  _count: {
    followed_by: number;
    following: number;
    book_owned_as: number;
    bookshelf: number;
    liked_book: number;
    review: number;
  };
}

export interface ProfileInterface {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date | null;
  private: boolean;
  description: string | null;
}

export interface FollowsInterface {
  follower_id: string;
  following_id: string;
  updated_at: Date | null;
}
