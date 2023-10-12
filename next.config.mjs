import "./env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        //discord avatar images
        hostname: "cdn.discordapp.com",
      },
      {
        //google avatar images
        hostname: "lh3.googleusercontent.com",
      },
      {
        //google books covers
        hostname: "books.google.com",
      },
    ],
  },
};

export default config;
