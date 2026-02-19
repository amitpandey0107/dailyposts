import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // LinkedIn media
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      // Common image CDNs and services
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.imgix.net",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      // Allow any HTTPS domain as fallback
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
