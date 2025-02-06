const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
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
        //github avatar images
        hostname: "avatars.githubusercontent.com",
      },
      {
        //google books covers
        hostname: "books.google.com",
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
