import "./env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "cdn.discordapp.com",
      },
    ],
  },
};

export default config;
