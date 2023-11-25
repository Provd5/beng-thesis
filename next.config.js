const withNextIntl = require("next-intl/plugin")();

module.exports = withNextIntl({
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
});
