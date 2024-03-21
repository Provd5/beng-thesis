import {
  type OrderType,
  type SortBookshelvesType,
  type SortBooksType,
  type SortFollowProfilesType,
  type SortProfilesType,
  type SortReviewBookshelfType,
  type SortReviewsType,
} from "~/types/sort";

export interface SortArrayInterface<T> {
  reverseOrder: boolean;
  orderBy: T;
}

export const orderArray: OrderType[] = ["desc", "asc"];

export const SortBooksArray: SortArrayInterface<SortBooksType>[] = [
  {
    reverseOrder: true,
    orderBy: "title",
  },
  {
    reverseOrder: true,
    orderBy: "authors",
  },
  {
    reverseOrder: false,
    orderBy: "published_date",
  },
  {
    reverseOrder: false,
    orderBy: "popularity",
  },
];

export const SortBookshelvesArray: SortArrayInterface<SortBookshelvesType>[] = [
  ...SortBooksArray,
  {
    reverseOrder: false,
    orderBy: "last_added",
  },
];

export const SortReviewBookshelfArray: SortArrayInterface<SortReviewBookshelfType>[] =
  [
    ...SortBooksArray,
    {
      reverseOrder: false,
      orderBy: "rate",
    },
    {
      reverseOrder: false,
      orderBy: "reactions",
    },
  ];

export const SortProfilesArray: SortArrayInterface<SortProfilesType>[] = [
  {
    reverseOrder: true,
    orderBy: "full_name",
  },
  {
    reverseOrder: false,
    orderBy: "activity",
  },
  {
    reverseOrder: false,
    orderBy: "owned_books",
  },
  {
    reverseOrder: false,
    orderBy: "books_on_shelves",
  },
  {
    reverseOrder: false,
    orderBy: "followers",
  },
  {
    reverseOrder: false,
    orderBy: "reviews",
  },
];

export const SortFollowProfilesArray: SortArrayInterface<SortFollowProfilesType>[] =
  [
    ...SortProfilesArray,
    {
      reverseOrder: false,
      orderBy: "last_added",
    },
  ];

export const SortReviewsArray: SortArrayInterface<SortReviewsType>[] = [
  {
    reverseOrder: false,
    orderBy: "rate",
  },
  {
    reverseOrder: false,
    orderBy: "created_at",
  },
  {
    reverseOrder: false,
    orderBy: "activity",
  },
  {
    reverseOrder: false,
    orderBy: "review_reaction",
  },
];
