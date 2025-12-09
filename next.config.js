/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.s3.eu-west-1.amazonaws.com", // Wildcard to handle dynamic subdomains
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "daxxgn860i5ze.cloudfront.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
