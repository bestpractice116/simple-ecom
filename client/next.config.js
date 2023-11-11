/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    swcMinify: true
  },
  images: {
    domains: ["pub-62ea6fadbade4a339c4b4bba374a6ec0.r2.dev"]
  }
};

module.exports = nextConfig;
