import { type reactionType } from "@prisma/client";

import { type ReviewInterface } from "../DataTypes";

interface ReviewCardDataInterface extends ReviewInterface {
  profile: {
    id: string;
    avatar_url: string | null;
    full_name: string | null;
    created_at: Date;
    _count: {
      bookshelf: number;
      review: number;
      liked_book: number;
    };
  };
}

interface ReviewReactionsInterface {
  OK: number;
  MEH: number;
  myReaction: reactionType | undefined;
}
