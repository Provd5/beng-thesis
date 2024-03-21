import { type CategoriesTypes } from "~/types/data/bookshelf";

import { convertTypeEnumToPathname } from "./pathnameTypeEnumConverter";

const ROUTES = {
  root: "/",
  community: "/community",
  search: "/search",

  auth: {
    login: "/login",
    signup: "/signup",
  },

  profile: {
    edit_profile: "/edit-profile",
    session_profile: "/profile",
    root: (profileName: string) => `/profile/${profileName}`,
    bookshelf: (bookshelf: CategoriesTypes) =>
      `./${convertTypeEnumToPathname(bookshelf)}`,
    followers: `./"followers"`,
    following: `./"following"`,
  },

  book: {
    root: (id: string, title: string) => `/book/${id}/${title}`,
    reviews: "./reviews",
  },
};

export default ROUTES;
