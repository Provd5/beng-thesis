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
    root: (fullname: string) => `/profile/${fullname}`,
    bookshelf: (fullname: string, bookshelf: string) =>
      `/profile/${fullname}/${bookshelf}`,
    followers: (fullname: string) => `/profile/${fullname}/followers`,
    following: (fullname: string) => `/profile/${fullname}/following`,
    statistics: (fullname: string) => `/profile/${fullname}/statistics`,
    back: (fullname: string) => `../${fullname}`,
  },

  book: {
    root: (id: string, title: string) => `/book/${id}/${title}`,
    back: (title: string) => `../${title}`,
    reviews: (id: string, title: string) => `/book/${id}/${title}/reviews`,
  },
};

export default ROUTES;
